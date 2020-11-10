package org.vaccineimpact.api.tests.controllers.coverage

import com.nhaarman.mockito_kotlin.anyOrNull
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.InMemoryRequestData
import org.vaccineimpact.api.app.controllers.CoverageController
import org.vaccineimpact.api.app.requests.MultipartDataMap
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class PopulatingCoverageTests : MontaguTests()
{
    @Test
    fun `can deserialize coverage`()
    {
        val mockContext = mock<ActionContext> {
            on { getParts(anyOrNull()) } doReturn MultipartDataMap(
                    "description" to InMemoryRequestData("some description"),
                    "file" to InMemoryRequestData(normalCSVDataString)
            )
        }
        val sut = CoverageController(mockContext, mock(), mock())
        val result = sut.getCoverageDataFromCSV().first

        assertThat(result.toList()).containsExactly(
                CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, true, 2020, 1, 10, GenderEnum.BOTH, 100F, 78.8F),
                CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, false, 2021, 1, 10, GenderEnum.FEMALE, 100F, 65.5F)
        )
    }

    @Test
    fun `deserializing coverage throws error on invalid activity type`()
    {
        val mockContext = mock<ActionContext> {
            on { getParts(anyOrNull()) } doReturn MultipartDataMap(
                    "description" to InMemoryRequestData("some description"),
                    "file" to InMemoryRequestData(invalidActivityTypeCSVDataString)
            )
        }
        val sut = CoverageController(mockContext, mock(), mock())
        val result = sut.getCoverageDataFromCSV().first

        assertThatThrownBy { result.toList() }
                .isInstanceOf(ValidationException::class.java)
    }

    @Test
    fun `deserializing coverage throws error on invalid column headers`()
    {
        val mockContext = mock<ActionContext> {
            on { getParts(anyOrNull()) } doReturn MultipartDataMap(
                    "description" to InMemoryRequestData("some description"),
                    "file" to InMemoryRequestData(invalidHeadersCSVDataString)
            )
        }
        val sut = CoverageController(mockContext, mock(), mock())
        assertThatThrownBy {
            sut.getCoverageDataFromCSV().first
        }.isInstanceOf(ValidationException::class.java)
    }

    @Test
    fun `can get coverage upload metadata`()
    {
        val mockContext = mock<ActionContext> {
            on { params(":touchstone-version-id") } doReturn "t1"
        }
        val fakeData = CoverageUploadMetadata("YF", "test.user", Instant.now())
        val mockRepo = mock<TouchstoneRepository> {
            on { getCoverageUploadMetadata("t1") } doReturn
                    listOf(fakeData)
        }
        val sut = CoverageController(mockContext, mock(), mockRepo)
        val result = sut.getCoverageUploadMetadata()
        assertThat(result[0]).isEqualToComparingFieldByField(fakeData)
    }

    private val normalCSVDataString = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "True",  "2020",         1,     10,    "both", 100, 78.8
   "HepB_BD",   "AFG",    "campaign",     "false",  "2021",         1,      10,    "Female", 100, 65.5
"""

    private val invalidActivityTypeCSVDataString = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "a campaign",     "true",  "2020",         1,     10,    100, "both", 78.8
"""

    private val invalidHeadersCSVDataString = """
"vaccine", "country code", "activity", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "a campaign",     "true",  "2020",         1,     10,    "both", 100, 78.8
"""

}
