package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
import org.vaccineimpact.api.db.direct.addModelVersion
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ModelTests : DatabaseTest()
{
    @Test
    fun `can get models`()
    {
        validate("/models/") against "Models" given {
            it.addGroup("groupId")
            it.addDisease("d1")
            it.addModel("modelId", "groupId", "d1", "description1")
            it.addModel("modelId2", "groupId", "d1", isCurrent = false)
            it.addModelVersion("modelId", "v1", setCurrent = true)
        } requiringPermissions {
            PermissionSet("*/models.read")
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(2)
            Assertions.assertThat(it).contains(json {
                obj(
                        "id" to "modelId",
                        "description" to "description1",
                        "citation" to "Unknown citation",
                        "modelling_group" to "groupId",
                        "gender_specific" to false,
                        "gender" to "both",
                        "current_version" to obj(
                                "id" to 1,
                                "version" to "v1",
                                "note" to "Some note",
                                "fingerprint" to "Some fingerprint",
                                "is_dynamic" to true,
                                "code" to "R",
                                "max_countries" to 100,
                                "model" to "modelId"
                        )
                )
            })
        }
    }

    @Test
    fun `can get model`()
    {
        validate("/models/modelId/") against "Model" given {
            it.addGroup("groupId")
            it.addDisease("d1")
            it.addModel("modelId", "groupId", "d1", "description1")
            it.addModel("modelId2", "groupId", "d1", isCurrent = false)
            it.addModelVersion("modelId", "v1", setCurrent = true)
        } requiringPermissions {
            PermissionSet("*/models.read")
        } andCheck {
            Assertions.assertThat(it).isEqualTo(json {
                obj(
                        "id" to "modelId",
                        "description" to "description1",
                        "citation" to "Unknown citation",
                        "modelling_group" to "groupId",
                        "gender_specific" to false,
                        "gender" to "both",
                        "current_version" to obj(
                                "id" to 1,
                                "version" to "v1",
                                "note" to "Some note",
                                "fingerprint" to "Some fingerprint",
                                "is_dynamic" to true,
                                "code" to "R",
                                "max_countries" to 100,
                                "model" to "modelId"
                        )
                )
            })

        }
    }


    @Test
    fun `can get model without current version`()
    {
        validate("/models/modelId/") against "Model" given {
            it.addGroup("groupId")
            it.addDisease("d1")
            it.addModel("modelId", "groupId", "d1", "description1")
        } requiringPermissions {
            PermissionSet("*/models.read")
        } andCheck {
            Assertions.assertThat(it).isEqualTo(json {
                obj(
                        "id" to "modelId",
                        "description" to "description1",
                        "citation" to "Unknown citation",
                        "modelling_group" to "groupId",
                        "gender_specific" to false,
                        "gender" to "both",
                        "current_version" to null
                )
            })

        }
    }

    @Test
    fun `get nonexistent model returns 404`()
    {
        val requestHelper = RequestHelper()
        val userHelper = TestUserHelper()

        JooqContext().use {
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("/models/nonexistentmodel/", PermissionSet("*/can-login","*/models.read"))
        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }
}