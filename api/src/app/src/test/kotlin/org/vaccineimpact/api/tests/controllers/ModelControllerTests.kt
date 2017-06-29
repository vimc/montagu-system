package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import org.assertj.core.api.Assertions.assertThat
import com.nhaarman.mockito_kotlin.mock
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModelController
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.permissions.PermissionSet


class ModelControllerTests : ControllerTests<ModelController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = ModelController(controllerContext)

    @Test
    fun `getModels returns all models`()
    {
        val models = listOf(Model("test", "test name", "test@test.com", ""))

        val permissionSet = PermissionSet()

        val modelRepo = mock<SimpleDataSet<Model, String>>{
            on {this.all()} doReturn models
        }

        val controllerContext = mockControllerContext(mock<SimpleObjectsRepository> {
            on { this.models } doReturn modelRepo
        })

        val context = mock<ActionContext> {
            on { permissions } doReturn permissionSet
        }

        val controller = ModelController(controllerContext)
        assertThat(controller.getModels(context))
    }

}
