package org.vaccineimpact.api.blackboxTests.tests.Coverage

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.COVERAGE
import org.vaccineimpact.api.db.Tables.COVERAGE_SET
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.db.direct.addVaccine
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod
import java.io.File

class UploadCoverageTests : CoverageTests()
{
    private val requiredPermissions = PermissionSet("*/coverage.write")

    @Test
    fun `can populate coverage`()
    {
        // this data is somewhat realistically sized - in practice will likely be fewer vaccines,
        // but for some vaccines more gavi support levels
        val data = File("coverage.csv").readText()
        setup()
        validate("/touchstones/$touchstoneVersionId/coverage/", method = HttpMethod.post) withRequestSchema {
            CSVSchema("CoverageIngestion")
        } sending {
           data
        } withPermissions {
            requiredPermissions
        } andCheckHasStatus 200..299

        verifyCorrectRows()
    }

    @Test
    fun `can populate coverage from multipart file request`()
    {
        // this data is somewhat realistically sized - in practice will likely be fewer vaccines,
        // but for some vaccines more gavi support levels
        val data = File("coverage.csv").readText()
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/", data, token = token)
        JSONValidator().validateSuccess(response.text)

        verifyCorrectRows()
    }

    private fun setup()
    {
        JooqContext().use { db ->

            db.addTouchstoneVersion("touchstone", 1, "description", "open", addTouchstone = true)
            listOf("HepB_BD", "HepB", "Hib3", "HPV", "JE", "MCV1", "MCV2",
                    "Measles", "MenA", "PCV3", "Rota", "Rubella", "YF",
                    "DTP3", "RCV2", "HepB_BD_home", "Cholera", "Typhoid")
                    .forEach {
                        db.addVaccine(it)
                    }
        }
    }

    private fun verifyCorrectRows()
    {
        JooqContext().use {
            val expectedNumberOfSets = 18 * 2 * 2 // vaccines, activities, support levels
            val coverageSets = it.dsl.selectFrom(COVERAGE_SET).fetch()
            assertThat(coverageSets.count()).isEqualTo(expectedNumberOfSets)

            val coverage = it.dsl.selectFrom(COVERAGE).fetch()
            val expectedNumberOfRows = expectedNumberOfSets * 11 * 73 // sets, years, countries
            assertThat(coverage.count()).isEqualTo(expectedNumberOfRows)
        }
    }
}
