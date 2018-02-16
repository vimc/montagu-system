package org.vaccineimpact.api.app.context

import org.apache.commons.fileupload.FileItemStream
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRequiredMultipartParameterError
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.requests.MultipartData
import org.vaccineimpact.api.app.requests.MultipartDataMap
import org.vaccineimpact.api.app.requests.contents
import org.vaccineimpact.api.app.security.montaguPermissions
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.ModelBinder
import spark.Request
import spark.Response
import java.io.BufferedOutputStream
import java.io.BufferedReader
import java.io.OutputStream
import java.io.Reader
import java.util.zip.GZIPOutputStream


class DirectActionContext(private val context: SparkWebContext) : ActionContext
{
    override val request
        get() = context.sparkRequest
    private val response
        get() = context.sparkResponse

    constructor(request: Request, response: Response)
            : this(SparkWebContext(request, response))

    override fun contentType(): String = request.contentType()
    override fun queryParams(key: String): String? = request.queryParams(key)
    override fun queryString(): String? = request.queryString()
    override fun params(): Map<String, String> = request.params()
    override fun params(key: String): String = request.params(key)
    override fun <T : Any> postData(klass: Class<T>): T = ModelBinder().deserialize(request.body(), klass)

    // Return one part as a stream
    override fun getPart(name: String, multipartData: MultipartData): Reader
    {
        val parts = getPartsAsSequence(multipartData)
        val matchingPart = parts.firstOrNull { it.fieldName == name }
                ?: throw MissingRequiredMultipartParameterError(name)

        return matchingPart.openStream().bufferedReader()
    }

    // Pull all parts into memory and return them as a map
    override fun getParts(multipartData: MultipartData): MultipartDataMap
    {
        val map = getPartsAsSequence(multipartData)
                .map { it.fieldName to InMemoryRequestData(it.contents()) }
                .toMap()
        return MultipartDataMap(map)
    }

    private fun getPartsAsSequence(multipartData: MultipartData): Sequence<FileItemStream>
    {
        val rawRequest = request.raw()
        val isMultipart = multipartData.isMultipartContent(rawRequest)
        if (!isMultipart)
        {
            throw BadRequest("Trying to extract a part from multipart/form-data " +
                    "but this request is of type ${request.contentType()}")
        }
        return multipartData.parts(rawRequest)
    }

    override fun requestReader(): BufferedReader = request.raw().inputStream.bufferedReader()

    override fun setResponseStatus(status: Int)
    {
        response.status(status)
    }

    override fun addResponseHeader(key: String, value: String)
    {
        response.header(key, value)
    }

    override fun addAttachmentHeader(filename: String)
    {
        addResponseHeader("Content-Disposition", """attachment; filename="$filename"""")
    }

    override fun hasPermission(requirement: ReifiedPermission): Boolean
    {
        return if (Config.authEnabled)
        {
            permissions.any { requirement.satisfiedBy(it) }
        }
        else
        {
            true
        }
    }

    override fun requirePermission(requirement: ReifiedPermission)
    {
        if (!hasPermission(requirement))
        {
            throw MissingRequiredPermissionError(setOf(requirement))
        }
    }

    override val permissions by lazy {
        userProfile!!.montaguPermissions
    }

    override val userProfile: CommonProfile? by lazy {
        val manager = ProfileManager<CommonProfile>(context)
        manager.getAll(false).singleOrNull()
    }
    override val username by lazy {
        userProfile?.id
    }

    override val redirectUrl: String? by lazy {
        queryParams("redirectUrl")
    }

    override fun streamedResponse(contentType: String, work: (OutputStream) -> Unit)
    {
        addDefaultResponseHeaders(request, response, contentType)
        val stream = response.raw().outputStream

        val outputStream =
                if (request.headers("Accept-Encoding").contains("gzip"))
                {
                    GZIPOutputStream(stream, BUFFER_SIZE)
                }
                else
                {
                    BufferedOutputStream(stream)
                }

        outputStream.use { out ->
            work(out)
        }
    }

    override fun redirect(url: String)
    {
        this.response.redirect(url)
    }
}

// https://stackoverflow.com/a/19032439/777939
// This is the default buffer size for BufferedOutputStream; GZipOutputStream uses a smaller value
// by default, and this leads to worse performance.
private const val BUFFER_SIZE = 8000