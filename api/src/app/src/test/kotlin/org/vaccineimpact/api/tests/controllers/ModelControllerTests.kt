package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import org.assertj.core.api.Assertions.assertThat
import com.nhaarman.mockito_kotlin.mock
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModelController
import org.vaccineimpact.api.app.repositories.Repositories
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

        val modelRepo = mock<SimpleDataSet<Model, String>>{
            on {this.all()} doReturn models
        }

        val sut = createSut(modelRepo)

        assertThat(sut.getModels(mock<ActionContext>())).isEqualTo(models)
    }

    @Test
    fun `getModel returns model`()
    {
        val modelId = "testId"
        val model = Model(modelId, "test name", "test@test.com", "")

        val modelRepo = mock<SimpleDataSet<Model, String>>{
            on {this.get(modelId)} doReturn model
        }

        val sut = createSut(modelRepo)

        val actionContext = mock<ActionContext>(){
            on {this.params(":id")} doReturn modelId

        }
        assertThat(sut.getModel(actionContext)).isEqualTo(model)
    }

    private fun createSut(modelRepo: SimpleDataSet<Model, String>) : ModelController{

        val simpleRepoMock = mock<SimpleObjectsRepository>{
            on { this.models } doReturn modelRepo
        }

        val reposMock = RepositoryMock<SimpleObjectsRepository>(
                { it.simpleObjects }, simpleRepoMock
        )

       return ModelController(mockControllerContext(reposMock))
    }

}
