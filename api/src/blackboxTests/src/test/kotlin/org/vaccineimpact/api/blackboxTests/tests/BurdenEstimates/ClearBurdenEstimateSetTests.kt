package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.EmptySchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class ClearBurdenEstimateSetTests : BurdenEstimateTests()
{
    val setId = 1
    val clearUrl = "$setUrl$setId/actions/clear/"

    @Test
    fun `can clear empty burden estimate set`()
    {
        validate(clearUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "empty")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        checkSetHasThisManyRows(0)
    }

    @Test
    fun `clearing burden estimate set which does not exist returns expected error`()
    {
        JooqContext().use { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        }
        val r = RequestHelper().post("${setUrl}99/actions/clear/", requiredWritePermissions + PermissionSet("*/can-login"))
        JSONValidator().validateError(r.text, "unknown-burden-estimate-set",
                "Unknown burden-estimate-set with id '99'")
    }

    @Test
    fun `clearing burden estimate set which belongs to a different group returns expected error`()
    {
        var burdenEstimateSet2 = 0
        JooqContext().use { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")

            //Add a second group, responsibility and burden estimate set
            val groupId2 = "group2"
            db.addGroup(groupId2, "Test group")
            db.addModel("model-2", groupId2, diseaseId)
            val modelVersionId2 = db.addModelVersion("model-2", "version-1", setCurrent = true)
            val rsetId2 = db.addResponsibilitySet(groupId2, touchstoneVersionId)
            val responsibilityId2 = db.addResponsibility(rsetId2, touchstoneVersionId, scenarioId)
            db.addExpectations(responsibilityId2, yearMinInclusive = 1996, yearMaxInclusive = 1997,
                    ageMaxInclusive = 50, ageMinInclusive = 50, countries = listOf("AFG", "AGO"))
            burdenEstimateSet2 = db.addBurdenEstimateSet(
                    responsibilityId2,
                    modelVersionId2,
                    TestUserHelper.username,
                    status = "partial",
                    setId = rsetId2
            )
        }
        val r = RequestHelper().post("$setUrl$burdenEstimateSet2/actions/clear/", requiredWritePermissions + PermissionSet("*/can-login"))
        JSONValidator().validateError(r.text, "unknown-burden-estimate-set",
                "Unknown burden-estimate-set with id '$burdenEstimateSet2'")
    }

    @Test
    fun `can clear burden estimate set with partial estimates`()
    {
        validate(clearUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        checkSetHasThisManyRows(0)
    }

    @Test
    fun `cannot clear burden estimate set in complete status`()
    {
        JooqContext().use { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "complete")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        }
        val r = RequestHelper().post(clearUrl, requiredWritePermissions + PermissionSet("*/can-login"))
        JSONValidator().validateError(r.text, "invalid-operation",
                "You cannot clear a burden estimate set which is marked as 'complete'.")

        checkSetHasThisManyRows(1)
    }

    private fun checkSetHasThisManyRows(expectedCount: Int)
    {
        JooqContext().use { db ->
            val count = db.dsl.selectCount().from(BURDEN_ESTIMATE).fetchOne(0, Int::class.java)
            assertThat(count).isEqualTo(expectedCount)
        }
    }
}