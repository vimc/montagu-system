package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class CreateBurdenEstimateTests : BurdenEstimateTests()
{
    @Test
    fun `can create burden estimate set without model run parameter set`()
    {
        validate(setUrl, method = HttpMethod.post) withRequestSchema "CreateBurdenEstimateSet" given { db ->
            setUp(db)
        } sendingJSON {
            metadataForCreate()
        } withPermissions {
            requiredWritePermissions.plus(PermissionSet("*/can-login"))
        } andCheckObjectCreation createdSetLocation
    }

    @Test
    fun `can create burden estimate set with model run parameter set`()
    {
        val setId = validate(setUrl, method = HttpMethod.post) withRequestSchema "CreateBurdenEstimateSet" given { db ->
            setUpWithModelRunParameterSet(db)
        } sendingJSON {
            metadataForCreateWithModelRunParameterSet()
        } withPermissions {
            requiredWritePermissions.plus(PermissionSet("*/can-login"))
        } andCheckObjectCreation createdSetLocation

        JooqContext().use { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId.toInt()))
            assertThat(record.modelRunParameterSet).isEqualTo(1)
        }
    }

    @Test
    fun `cannot create burden estimate set with model run parameter set belonging to another group`()
    {
        var paramSetId: Int? = null
        JooqContext().use { db ->
            TestUserHelper().setupTestUser(db)
            setUp(db)
            val groupId2 = "group-2"
            val modelId2 = "model-2"
            db.addGroup(groupId2, "Test group")
            db.addModel(modelId2, groupId2, diseaseId)
            val modelVersionId = db.addModelVersion(modelId2, "version-1", setCurrent = true)
            val respSetId = db.addResponsibilitySet(groupId2, touchstoneVersionId)
            paramSetId =  db.addModelRunParameterSet(respSetId, modelVersionId, TestUserHelper.username)
        }
        val permissions = requiredWritePermissions.plus(PermissionSet("*/can-login"))
        val data = json {
            obj(
                    "type" to obj("type" to "central-averaged"),
                    "model_run_parameter_set" to paramSetId!!
            )
        }
        val response = RequestHelper().post(setUrl, permissions, data = data)
        JSONValidator().validateError(response.text, "unknown-model-run-parameter-set")
    }

    @Test
    fun `cannot create stochastic burden estimate set without model run parameter set`()
    {
        JooqContext().use { db ->
            TestUserHelper().setupTestUser(db)
            setUpWithModelRunParameterSet(db)
        }
        val permissions = requiredWritePermissions.plus(PermissionSet("*/can-login"))
        val data = json {
            obj(
                    "type" to obj("type" to "stochastic"),
                    "model_run_parameter_set" to null
            )
        }
        val response = RequestHelper().post(setUrl, permissions, data = data)
        JSONValidator().validateError(response.text, "invalid-field:model_run_parameter_set:missing")
    }

    private val createdSetLocation = LocationConstraint(
            "/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimate-sets/", unknownId = true
    )

    private fun metadataForCreate() = json {
        obj("type" to obj(
                "type" to "central-averaged",
                "details" to "median"
        ))
    }

    private fun metadataForCreateWithModelRunParameterSet() = json {
        obj(
                "type" to obj(
                        "type" to "central-averaged",
                        "details" to "median"
                ),
                "model_run_parameter_set" to 1
        )
    }
}