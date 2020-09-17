package org.vaccineimpact.api.tests.controllers.BurdenEstimates

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ChunkedFileManager.Companion.UPLOAD_DIR
import org.vaccineimpact.api.app.clients.TaskQueueClient
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.BurdenEstimates.BurdenEstimateUploadController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import java.io.File

class PopulatingEstimatesTests : UploadBurdenEstimatesControllerTests()
{
    @Test
    fun `can populate central estimate set from local file`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mockLogic()

        val uid = "uid"

        createTempCSVFile(uid)

        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val repo = mockEstimatesRepository(touchstoneSet)
        val cache = makeFakeCacheWithChunkedFile(uid, uploadFinished = true, fileName = "file.csv")
        val mockTokenHelper = getMockTokenHelper("user.name", uid)
        val mockTaskQueueClient = mock<TaskQueueClient>()
        val sut = BurdenEstimateUploadController(mockContext, logic, mock(), repo, mock(),
                mockTokenHelper, cache, mock(), mock(), mockTaskQueueClient)

        val result = sut.populateBurdenEstimateSetFromLocalFile()

        assertThat(result.status).isEqualTo(ResultStatus.SUCCESS)
        assertThat(result.data).isEqualTo("OK")
        verify(logic).populateBurdenEstimateSet(eq(1), eq(groupId), eq(touchstoneVersionId), eq(scenarioId), any(), eq("file.csv"))
        verify(logic).closeBurdenEstimateSet(1, groupId, touchstoneVersionId, scenarioId)
        verify(mockTaskQueueClient).runDiagnosticReport(groupId, diseaseId, touchstoneVersionId)
    }

    @Test
    fun `MissingRowsErrors are caught and returned as a Result`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mock<BurdenEstimateLogic> {
            on { populateBurdenEstimateSet(any(), any(), any(), any(), any(), anyOrNull()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(4).toList()
                Unit
            }
            on { closeBurdenEstimateSet(any(), any(), any(), any()) } doThrow MissingRowsError("TEST")
        }

        val uid = "uid"

        createTempCSVFile(uid)

        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val repo = mockEstimatesRepository(touchstoneSet)
        val cache = makeFakeCacheWithChunkedFile(uid, uploadFinished = true)
        val mockTokenHelper = getMockTokenHelper("user.name", uid)

        val sut = BurdenEstimateUploadController(mockContext, logic, mock(), repo, mock(), mockTokenHelper, cache)

        val result = sut.populateBurdenEstimateSetFromLocalFile()
        assertThat(result.status).isEqualTo(ResultStatus.FAILURE)
        assertThat(result.errors[0]).isEqualTo(ErrorInfo("missing-rows", "TEST"))
    }

    @Test
    fun `arbitrary errors are not caught but thrown as usual`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mock<BurdenEstimateLogic> {
            on { populateBurdenEstimateSet(any(), any(), any(), any(), any(), anyOrNull()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(4).toList()
                Unit
            }
            on { closeBurdenEstimateSet(any(), any(), any(), any()) } doThrow NullPointerException("TEST")
        }

        val uid = "uid"

        createTempCSVFile(uid)

        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val repo = mockEstimatesRepository(touchstoneSet)
        val cache = makeFakeCacheWithChunkedFile(uid, uploadFinished = true)
        val mockTokenHelper = getMockTokenHelper("user.name", uid)

        val sut = BurdenEstimateUploadController(mockContext, logic, mock(), repo, mock(), mockTokenHelper, cache)

        assertThatThrownBy {
            sut.populateBurdenEstimateSetFromLocalFile()
        }.isInstanceOf(NullPointerException::class.java)

    }

    @Test
    fun `populating central estimate set from local file deletes file and clears cache item on success`()
    {
        val touchstoneSet = mockTouchstones()
        val logic = mockLogic()
        val uid = "uid"

        val file = File(uid)
        val tempFile = createTempCSVFile(uid)

        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val repo = mockEstimatesRepository(touchstoneSet)
        val cache = makeFakeCacheWithChunkedFile(uid, uploadFinished = true)
        val mockTokenHelper = getMockTokenHelper("user.name", uid)

        val sut = BurdenEstimateUploadController(mockContext, logic, mock(),
                repo, mock(), mockTokenHelper, cache, mock(), mock(), mock())

        val result = sut.populateBurdenEstimateSetFromLocalFile()

        assertThat(result.status).isEqualTo(ResultStatus.SUCCESS)
        assertThat(result.data).isEqualTo("OK")
        assertThat(cache[uid]).isNull()
        assertThat(tempFile.exists()).isFalse()
        assertThat(file.exists()).isFalse()
    }

    @Test
    fun `populating set from local file throws error if uid not recognised`()
    {
        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val mockTokenHelper = getMockTokenHelper("user.name", "uid")

        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(), mockTokenHelper, mock())

        assertThatThrownBy { sut.populateBurdenEstimateSetFromLocalFile() }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Unrecognised file identifier - has this token already been used?")

    }

    @Test
    fun `populating set from local file requires file to be fully uploaded`()
    {
        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val mockTokenHelper = getMockTokenHelper("user.name", "uid")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = false)

        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                mockTokenHelper, fakeCache)

        assertThatThrownBy { sut.populateBurdenEstimateSetFromLocalFile() }
                .isInstanceOf(InvalidOperationError::class.java)
                .hasMessageContaining("This file has not been fully uploaded")

    }

    @Test
    fun `populating set from local file requires token to be validated`()
    {
        val mockContext = mockPopulateFromLocalFileActionContext("user.name")
        val fakeCache = makeFakeCacheWithChunkedFile("uid", uploadFinished = true)

        val sut = BurdenEstimateUploadController(mockContext, mock(), mock(), mock(), mock(),
                WebTokenHelper(KeyHelper.keyPair),
                fakeCache)

        assertThatThrownBy { sut.populateBurdenEstimateSetFromLocalFile() }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining("upload-token")

    }

    private fun createTempCSVFile(fileName: String): File
    {
        File(UPLOAD_DIR).mkdir()
        val tempFile = File("$UPLOAD_DIR/$fileName.temp")
        tempFile.createNewFile()
        tempFile.writeText(normalCSVDataString)
        return tempFile
    }

    private fun mockPopulateFromLocalFileActionContext(user: String): ActionContext
    {
        return mock {
            on { username } doReturn user
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
            on { params(":token") } doReturn "faketoken"
        }
    }

}