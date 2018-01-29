package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ModelController
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.test_helpers.MontaguTests


class ModelControllerTests : MontaguTests()
{
    @Test
    fun `getModels returns all models`()
    {
        val models = listOf(Model("test", "test name", "test@test.com", ""))

        val modelRepo = mock<ModelRepository> {
            on { this.all() } doReturn models
        }

        val sut = ModelController(mock<ActionContext>(), modelRepo)

        assertThat(sut.getModels()).isEqualTo(models)
    }

    @Test
    fun `getModel returns model`()
    {
        val modelId = "testId"
        val model = Model(modelId, "test name", "test@test.com", "")

        val modelRepo = mock<ModelRepository> {
            on { this.get(modelId) } doReturn model
        }

        val actionContext = mock<ActionContext> {
            on { this.params(":id") } doReturn modelId
        }

        val sut = ModelController(actionContext, modelRepo)

        assertThat(sut.getModel()).isEqualTo(model)
    }
}
