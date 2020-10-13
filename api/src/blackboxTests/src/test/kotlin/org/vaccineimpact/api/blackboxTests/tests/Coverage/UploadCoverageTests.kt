package org.vaccineimpact.api.blackboxTests.tests.Coverage

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.joda.time.DateTime
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.COVERAGE
import org.vaccineimpact.api.db.direct.addCoverageSet
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import java.io.File

class UploadCoverageTests : CoverageTests()
{
    val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "*/coverage.read")

    @Test
    fun `can populate coverage`()
    {
        JooqContext().use { db ->

            db.addTouchstoneVersion("touchstone", 1, "description", "open", addTouchstone = true)
            var i = 0
            listOf("HepB_BD", "HepB", "Hib3", "HPV", "JE", "MCV1", "MCV2",
                    "Measles", "MenA", "PCV3", "Rota", "Rubella", "YF",
                    "DTP3", "RCV2", "HepB_BD_home", "Cholera", "Typhoid")
                    .forEach {
                        db.addCoverageSet(
                                touchstoneVersionId,
                                "coverage set name",
                                it,
                                "without",
                                "routine",
                                coverageSetId + i,
                                addVaccine = true)
                        i++
                        db.addCoverageSet(
                                touchstoneVersionId,
                                "coverage set name",
                                it,
                                "with",
                                "routine",
                                coverageSetId + i)
                        i++
                        db.addCoverageSet(
                                touchstoneVersionId,
                                "coverage set name",
                                it,
                                "without",
                                "campaign",
                                coverageSetId + i)
                        i++
                        db.addCoverageSet(
                                touchstoneVersionId,
                                "coverage set name",
                                it,
                                "with",
                                "campaign",
                                coverageSetId + i)
                        i++
                    }
        }
        val token = TestUserHelper.setupTestUserAndGetToken(minimumPermissions, includeCanLogin = true)
        val file = File("coverage.csv")
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/", file.readText(), token = token)
        JSONValidator().validateSuccess(response.text)

        JooqContext().use {
            val coverage = it.dsl.selectFrom(COVERAGE).fetch()
            val expectedNumberOfRows = 18 * 11 * 2 * 2 * 73 // vaccines, years, activities, support levels, countries
            assertThat(coverage.count()).isEqualTo(expectedNumberOfRows)
        }
    }

}