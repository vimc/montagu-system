package org.vaccineimpact.api.tests.controllers.coverage

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.CoverageController
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.validation.ValidationException
import org.vaccineimpact.api.test_helpers.MontaguTests

class PopulatingCoverageTests : MontaguTests()
{
    @Test
    fun `can deserialize coverage`()
    {
        val mockContext = mock<ActionContext> {
            on { contentType() } doReturn "text/csv"
            on { this.getInputStream() } doReturn normalCSVDataString.byteInputStream()
        }
        val sut = CoverageController(mockContext, mock(), PostDataHelper())
        val result = sut.getCoverageDataFromCSV()
        assertThat(result.toList()).containsExactly(
                CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, 2020, 1, 10, GenderEnum.BOTH, 100F, 78.8F),
                CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, 2021, 1, 10, GenderEnum.FEMALE, 100F, 65.5F)
        )
    }

    @Test
    fun `deserializing coverage throws error on invalid gavi support level`()
    {
        val mockContext = mock<ActionContext> {
            on { contentType() } doReturn "text/csv"
            on { this.getInputStream() } doReturn invalidSupportLevelCSVDataString.byteInputStream()
        }
        val sut = CoverageController(mockContext, mock(), PostDataHelper())
        val result = sut.getCoverageDataFromCSV()
        assertThatThrownBy { result.toList() }
                .isInstanceOf(ValidationException::class.java)
    }

    @Test
    fun `deserializing coverage throws error on invalid activity type`()
    {
        val mockContext = mock<ActionContext> {
            on { contentType() } doReturn "text/csv"
            on { this.getInputStream() } doReturn invalidActivityTypeCSVDataString.byteInputStream()
        }
        val sut = CoverageController(mockContext, mock(), PostDataHelper())
        val result = sut.getCoverageDataFromCSV()
        assertThatThrownBy { result.toList() }
                .isInstanceOf(ValidationException::class.java)
    }

    @Test
    fun `deserializing coverage throws error on invalid column headers`()
    {
        val mockContext = mock<ActionContext> {
            on { contentType() } doReturn "text/csv"
            on { this.getInputStream() } doReturn invalidHeadersCSVDataString.byteInputStream()
        }
        val sut = CoverageController(mockContext, mock(), PostDataHelper())
        assertThatThrownBy { sut.getCoverageDataFromCSV() }
                .isInstanceOf(ValidationException::class.java)
    }

    private val normalCSVDataString = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "with",  "2020",         1,     10,    "both", 100, 78.8
   "HepB_BD",   "AFG",    "campaign",     "with",  "2021",         1,      10,    "Female", 100, 65.5
"""

    private val invalidSupportLevelCSVDataString = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "withsupport",  "2020",         1,     10,    "both", 100, 78.8
"""

    private val invalidActivityTypeCSVDataString = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "a campaign",     "with",  "2020",         1,     10,    100, "both", 78.8
"""

    private val invalidHeadersCSVDataString = """
"vaccine", "country code", "activity", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "a campaign",     "with",  "2020",         1,     10,    "both", 100, 78.8
"""

}
