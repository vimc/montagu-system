package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.*
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestDataSource
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.models.ChunkedFile
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.app.requests.csvData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.TokenType
import org.vaccineimpact.api.security.WebTokenHelper

class BurdenEstimateUploadController(context: ActionContext,
                                     private val repositories: Repositories,
                                     private val estimatesLogic: BurdenEstimateLogic,
                                     private val estimateRepository: BurdenEstimateRepository,
                                     private val postDataHelper: PostDataHelper = PostDataHelper(),
                                     private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair),
                                     private val chunkedFileCache: Cache<ChunkedFile> = ChunkedFileCache.instance,
                                     private val chunkedFileManager: ChunkedFileManager = ChunkedFileManager())
    : BaseBurdenEstimateController(context, estimatesLogic)
{
    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            repos,
            RepositoriesBurdenEstimateLogic(repos.modellingGroup, repos.burdenEstimates, repos.expectations),
            repos.burdenEstimates)

    fun getUploadToken(): String
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()

        // Check that this is a central estimate set
        val metadata = estimateRepository.getBurdenEstimateSet(path.groupId,
                path.touchstoneVersionId,
                path.scenarioId,
                setId)

        if (metadata.isStochastic())
        {
            throw InvalidOperationError("Stochastic estimate upload not supported")
        }

        return tokenHelper.generateUploadEstimatesToken(
                context.username!!,
                path.groupId,
                path.touchstoneVersionId,
                path.scenarioId,
                setId)
    }

    fun uploadBurdenEstimateFile(): String
    {
        val resumableChunkNumber = context.queryParams("resumableChunkNumber")?.toInt()
                ?: throw BadRequest("Missing required query parameter: resumableChunkNumber")

        val metadata = getFileMetadata()

        // Get file from context (supports multi-part or octet stream)
        val source = RequestDataSource.fromContentType(context)
        val stream = source.getContent()

        chunkedFileManager.writeChunk(stream, context.contentLength, metadata, resumableChunkNumber)

        //Mark as uploaded
        metadata.uploadedChunks[resumableChunkNumber] = true
        return okayResponse()
    }

    fun populateBurdenEstimateSet() = populateBurdenEstimateSet(RequestDataSource.fromContentType(context))
    fun populateBurdenEstimateSet(source: RequestDataSource): Result
    {
        return ResultRedirector(tokenHelper, repositories).redirectIfRequested(context, "".asResult()) { repos ->
            val estimateRepository = repos.burdenEstimates

            // First check if we're allowed to see this touchstoneVersion
            val path = getValidResponsibilityPath(context, estimateRepository)

            // Next, get the metadata that will enable us to interpret the CSV
            val setId = context.params(":set-id").toInt()
            val metadata = estimateRepository.getBurdenEstimateSet(path.groupId,
                    path.touchstoneVersionId,
                    path.scenarioId,
                    setId)

            // Then add the burden estimates
            val data = getBurdenEstimateDataFromCSV(metadata, source)
            estimatesLogic.populateBurdenEstimateSet(
                    setId,
                    path.groupId, path.touchstoneVersionId, path.scenarioId,
                    data
            )

            // Then, maybe close the burden estimate set
            val keepOpen = context.queryParams("keepOpen")?.toBoolean() ?: false
            if (!keepOpen)
            {
                closeEstimateSetAndReturnMissingRowError(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
            }
            else
            {
                okayResponse().asResult()
            }
        }
    }

    private fun getFileMetadata(): ChunkedFile
    {
        val totalChunks = context.queryParams("resumableTotalChunks")?.toInt()
        val totalSize = context.queryParams("resumableTotalSize")?.toLong()
        val chunkSize = context.queryParams("resumableChunkSize")?.toLong()
        val uploadToken = context.queryParams("resumableIdentifier")
        val filename = context.queryParams("resumableFilename")

        if (totalChunks == null || totalSize == null || chunkSize == null ||
                uploadToken.isNullOrEmpty() || filename.isNullOrEmpty())
        {
            throw BadRequest("You must include all resumablejs query parameters")
        }

        // Note expired tokens will throw an error during verification
        val claims = tokenHelper.verify(uploadToken!!, TokenType.UPLOAD)

        if (claims["sub"] != context.username!!)
        {
            throw BadRequest("The given token has not been issued for this user")
        }

        val uniqueIdentifier = claims["uid"].toString()
        val cachedMetadata = chunkedFileCache[uniqueIdentifier]
        val providedMetadata = ChunkedFile(totalChunks = totalChunks, chunkSize = chunkSize,
                totalSize = totalSize, uniqueIdentifier = uniqueIdentifier, originalFileName = filename!!)

        return if (cachedMetadata != null)
        {
            if (cachedMetadata != providedMetadata){
                throw BadRequest("The given token has already been used to upload a different file." +
                        " Please request a fresh upload token.")
            }
            cachedMetadata
        }
        else
        {
            chunkedFileCache.put(providedMetadata)
            providedMetadata
        }
    }

    private fun getBurdenEstimateDataFromCSV(
            metadata: BurdenEstimateSet,
            source: RequestDataSource
    ): Sequence<BurdenEstimateWithRunId>
    {
        return if (metadata.type.type == BurdenEstimateSetTypeCode.STOCHASTIC)
        {
            postDataHelper.csvData<StochasticBurdenEstimate>(from = source).map {
                BurdenEstimateWithRunId(it)
            }
        }
        else
        {
            postDataHelper.csvData<BurdenEstimate>(from = source).map {
                BurdenEstimateWithRunId(it, runId = null)
            }
        }
    }

}