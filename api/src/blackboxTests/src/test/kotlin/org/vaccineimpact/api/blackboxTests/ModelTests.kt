package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
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
        } requiringPermissions {
            PermissionSet("*/models.read")
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(2)
            Assertions.assertThat(it).contains(json { obj(
                    "id" to "modelId",
                    "description" to "description1",
                    "citation" to "Unknown citation",
                    "modelling_group" to "groupId"
            )})
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
        } requiringPermissions {
            PermissionSet("*/models.read")
        } andCheck {
            Assertions.assertThat(it).isEqualTo(json { obj(
                    "id" to "modelId",
                    "description" to "description1",
                    "citation" to "Unknown citation",
                    "modelling_group" to "groupId"
            )})

        }
    }
}