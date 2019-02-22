package org.vaccineimpact.api.tests.controllers.BurdenEstimates

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.assertj.core.util.diff.Chunk
import org.junit.Test
import org.mockito.Mockito
import org.vaccineimpact.api.app.Cache
import org.vaccineimpact.api.app.ChunkedFileCache
import org.vaccineimpact.api.app.ChunkedFileManager
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.BurdenEstimates.BurdenEstimateUploadController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.models.ChunkedFile
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.security.TokenType
import org.vaccineimpact.api.security.TokenValidationException
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.tests.mocks.mockCSVPostData
import java.io.InputStream

open class UploadBurdenEstimatesControllerTests : BurdenEstimateControllerTestsBase()
{
    @Test
    fun `can get upload token`()
    {
        val mockTokenHelper = mock<WebTokenHelper> {
            on { generateUploadEstimatesToken("username", "group-1", "touchstone-1", "scenario-1", 1) } doReturn "TOKEN"
        }

        val repo = mockEstimatesRepository(mockTouchstones())
        val sut = BurdenEstimateUploadController(mockActionContext(), mock(), mockLogic(),
                repo, mock(),
                mockTokenHelper)
        val result = sut.getUploadToken()
        verify(repo).getBurdenEstimateSet("group-1", "touchstone-1", "scenario-1", 1)
        assertThat(result).isEqualTo("TOKEN")
    }


    @Test
    fun `can not get upload token for stochastic set`()
    {
        val mockTokenHelper = mock<WebTokenHelper> {
            on { generateUploadEstimatesToken("username", "group-1", "touchstone-1", "scenario-1", 1) } doReturn "TOKEN"
        }

        val repo = mockEstimatesRepository(mockTouchstones(), existingBurdenEstimateSet = defaultEstimateSet.copy(
                type = BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC)))

        val sut = BurdenEstimateUploadController(mockActionContext(), mock(), mockLogic(),
                repo, mock(),
                mockTokenHelper)
        assertThatThrownBy { sut.getUploadToken() }
                .isInstanceOf(InvalidOperationError::class.java)
                .hasMessageContaining("Stochastic estimate upload not supported")

    }

    @Test
    fun `can populate central estimate set`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mockLogic()

        val expectedData = listOf(
                BurdenEstimateWithRunId("yf", null, 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                BurdenEstimateWithRunId("yf", null, 1980, 30, "AGO", "Angola", 2000F, mapOf(
                        "deaths" to 20F,
                        "cases" to 73.6F
                ))
        )

        val mockContext = mockActionContext()
        verifyLogicIsInvokedToPopulateSet(mockContext, mockEstimatesRepository(touchstoneSet), logic, touchstoneSet,
                normalCSVData.asSequence(), expectedData)
    }

    @Test
    fun `can populate stochastic estimate set`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mockLogic()

        val csvData = listOf(
                StochasticBurdenEstimate("yf", "runA", 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                StochasticBurdenEstimate("yf", "runB", 1980, 30, "AGO", "Angola", 2000F, mapOf(
                        "deaths" to 20F,
                        "dalys" to 73.6F
                ))
        )
        val expectedData = listOf(
                BurdenEstimateWithRunId("yf", "runA", 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                BurdenEstimateWithRunId("yf", "runB", 1980, 30, "AGO", "Angola", 2000F, mapOf(
                        "deaths" to 20F,
                        "dalys" to 73.6F
                ))
        )

        val mockContext = mockActionContext()
        val repo = mockEstimatesRepository(touchstoneSet, existingBurdenEstimateSet = defaultEstimateSet.copy(
                type = BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC)))
        verifyLogicIsInvokedToPopulateSet(mockContext, repo, logic, touchstoneSet,
                csvData.asSequence(), expectedData)
    }

    @Test
    fun `if keepOpen is not provided, populate closes estimate set`()
    {
        // This way, the webapps will carry on with the same behaviour as before.
        // It's only if a client explicitly sets keepOpen that we will see the partial state
        populateAndCheckIfSetIsClosed(keepOpen = null, expectedClosed = true)
    }

    @Test
    fun `if keepOpen is true, burden estimate set is left open`()
    {
        populateAndCheckIfSetIsClosed(keepOpen = "true", expectedClosed = false)
    }

    @Test
    fun `if keepOpen is false, populate closes burden estimate set`()
    {
        populateAndCheckIfSetIsClosed(keepOpen = "false", expectedClosed = true)
    }

    @Test
    fun `populate burden estimate set catches missing row error and returns result`()
    {
        val logic = mockLogic()
        Mockito.`when`(logic.closeBurdenEstimateSet(any(), any(), any(), any()))
                .doThrow(MissingRowsError("message"))
        val repo = mockEstimatesRepository()
        val mockContext = mockActionContext()
        val mockPostData = mockCSVPostData(normalCSVData)
        val result = BurdenEstimateUploadController(mockContext, mockRepositories(repo), logic, repo,
                postDataHelper = mockPostData).populateBurdenEstimateSet()
        assertThat(result.status).isEqualTo(ResultStatus.FAILURE)
    }

    @Test
    fun `uploading file requires token to be validated`()
    {
        val mockContext = mockResumableUploadActionContext("uid")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                chunkedFileCache = fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(TokenValidationException::class.java)
                .hasMessageContaining("Could not verify token")

    }

    @Test
    fun `uploading file requires chunkNumber query parameter`()
    {
        val mockContext = mockActionContext(user = "user.name")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mock(), fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Missing required query parameter: chunkNumber")
    }

    @Test
    fun `uploading file requires totalChunks query parameter`()
    {
        val mockContext = mock<ActionContext> {
            on { queryParams("chunkNumber") } doReturn "1"
        }

        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mock(), fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Missing required query parameter: totalChunks")
    }

    @Test
    fun `uploading file requires totalSize query parameter`()
    {
        val mockContext = mock<ActionContext> {
            on { queryParams("chunkNumber") } doReturn "1"
            on { queryParams("totalChunks") } doReturn "1"
        }

        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mock(), fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Missing required query parameter: totalSize")
    }

    @Test
    fun `uploading file requires chunkSize query parameter`()
    {
        val mockContext = mock<ActionContext> {
            on { queryParams("chunkNumber") } doReturn "1"
            on { queryParams("totalChunks") } doReturn "1"
            on { queryParams("totalSize") } doReturn "1"
        }

        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mock(), fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Missing required query parameter: chunkSize")
    }


    @Test
    fun `uploading file requires fileName query parameter`()
    {
        val mockContext = mock<ActionContext> {
            on { queryParams("chunkNumber") } doReturn "1"
            on { queryParams("totalChunks") } doReturn "1"
            on { queryParams("totalSize") } doReturn "1"
            on { queryParams("chunkSize") } doReturn "1"
        }

        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mock(), fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Missing required query parameter: fileName")
    }

    @Test
    fun `uploading file requires token username to match the current username`()
    {
        val mockContext = mockResumableUploadActionContext("uid", fileName = "file.csv", user = "wrong.name")
        val mockTokenHelper = getMockTokenHelper("user.name", "uid")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(), mockTokenHelper, fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("The given token has not been issued for this user")

    }

    @Test
    fun `uploading file fails when cached metadata does not match provided metadata`()
    {
        val mockContext = mockResumableUploadActionContext("uid", "wrong.file", "user.name")
        val mockTokenHelper = getMockTokenHelper("user.name", "uid")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)
        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mockTokenHelper, fakeCache)

        assertThatThrownBy { sut.uploadBurdenEstimateFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("The given token has already been used to upload a different file. " +
                        "Please request a fresh upload token.")

    }

    @Test
    fun `uploading file succeeds when cached and provided metadata match`()
    {
        val mockContext = mockResumableUploadActionContext("uid")
        val mockTokenHelper = getMockTokenHelper("user.name", "uid")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = false)

        var chunkWritten = false

        class MockFileManager: ChunkedFileManager() {
            override fun writeChunk(inputStream: InputStream,
                                    contentLength: Int,
                                    metadata: ChunkedFile,
                                    currentChunk: Int) {
                if (metadata == fakeCache["uid"])
                {
                    chunkWritten = true
                }
            }
        }

        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mockTokenHelper, fakeCache, MockFileManager())

        sut.uploadBurdenEstimateFile()
        assertThat(chunkWritten).isTrue()
    }

    protected fun getMockTokenHelper(username: String, uid: String): WebTokenHelper
    {
        return mock {
            on { verify(any(), eq(TokenType.UPLOAD)) } doReturn
                    mapOf(
                            "sub" to username,
                            "group-id" to "g1",
                            "scenario-id" to "s1",
                            "touchstone-id" to "t1",
                            "set-id" to 1,
                            "uid" to uid)
        }
    }

    protected fun makeFakeCacheWithChunkedFile(uid: String, uploadFinished: Boolean): Cache<ChunkedFile>
    {
        val fakeInfo = ChunkedFile(totalChunks = 1, totalSize = 1000, chunkSize = 100,
                uniqueIdentifier = uid, originalFileName = "filename.csv")

        if (uploadFinished)
        {
            fakeInfo.uploadedChunks[1] = true
        }
        val cache = ChunkedFileCache()
        cache.put(fakeInfo)
        return cache
    }

    protected fun populateAndCheckIfSetIsClosed(keepOpen: String?, expectedClosed: Boolean)
    {
        val timesExpected = if (expectedClosed) times(1) else never()

        val logic = mockLogic()
        val repo = mockEstimatesRepository()
        val mockContext = mockActionContext(keepOpen = keepOpen)
        val mockPostData = mockCSVPostData(normalCSVData)
        BurdenEstimateUploadController(mockContext, mockRepositories(repo), logic, repo, postDataHelper = mockPostData).populateBurdenEstimateSet()
        verify(logic, timesExpected).closeBurdenEstimateSet(defaultEstimateSet.id,
                "group-1", "touchstone-1", "scenario-1")
    }

    protected fun mockActionContext(user: String = "username", keepOpen: String? = null): ActionContext
    {
        return mock {
            on { username } doReturn user
            on { contentType() } doReturn "text/csv"
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-version-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
            on { queryParams("keepOpen") } doReturn keepOpen
        }
    }

    protected fun mockResumableUploadActionContext(uploadToken: String,
                                                 fileName: String = "filename.csv",
                                                 user: String = "user.name"): ActionContext
    {
        return mock {
            on { username } doReturn user
            on { contentType() } doReturn "text/csv"
            on { contentLength() } doReturn 1000
            on { getInputStream() } doReturn "TEST".byteInputStream()
            on { params(":token") } doReturn uploadToken
            on { queryParams("totalChunks") } doReturn "1"
            on { queryParams("totalSize") } doReturn "1000"
            on { queryParams("chunkSize") } doReturn "100"
            on { queryParams("chunkNumber") } doReturn "1"
            on { queryParams("fileName") } doReturn fileName
        }
    }

    protected fun <T : Any> verifyLogicIsInvokedToPopulateSet(
            actionContext: ActionContext,
            repo: BurdenEstimateRepository,
            logic: BurdenEstimateLogic,
            touchstoneVersionSet: SimpleDataSet<TouchstoneVersion, String>,
            actualData: Sequence<T>,
            expectedData: List<BurdenEstimateWithRunId>
    )
    {
        val postDataHelper = mock<PostDataHelper> {
            on { csvData<T>(any(), any()) } doReturn actualData
        }

        val sut = BurdenEstimateUploadController(actionContext, mockRepositories(repo), logic, repo,
                postDataHelper = postDataHelper)

        sut.populateBurdenEstimateSet()
        verify(touchstoneVersionSet).get("touchstone-1")
        verify(logic).populateBurdenEstimateSet(eq(1),
                eq("group-1"), eq("touchstone-1"), eq("scenario-1"),
                argWhere {
                    it.toSet() == expectedData.toSet()
                }
        )
    }

    protected val normalCSVData = listOf(
            BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimate("yf", 1980, 30, "AGO", "Angola", 2000F, mapOf(
                    "deaths" to 20F,
                    "cases" to 73.6F
            ))
    )

    protected val normalCSVDataString = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases"
   "yf",   2000,    50,     "AFG",  "Afghanistan",         1000,     10,    100
   "yf",   1980,    30,     "AGO",  "Angola",         2000,      20,    73.6
"""

    protected fun mockRepositories(repo: BurdenEstimateRepository) = mock<Repositories> {
        on { burdenEstimates } doReturn repo
    }

    private val mockStream = mock<InputStream> {
        on { it.read() } doReturn 1
        on { it.read(any()) } doReturn 1
        on { it.read(any(), any(), any()) } doReturn 1
    }

}