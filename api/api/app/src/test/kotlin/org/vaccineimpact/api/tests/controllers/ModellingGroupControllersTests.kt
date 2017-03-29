package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.tests.MontaguTests
import spark.Request
import spark.Response

class ModellingGroupControllersTests : MontaguTests()
{
    @Test
    fun `getResponsibilities gets parameters from URL`()
    {
        val repo = mock<ModellingGroupRepository>()
        val request = mock<Request> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
        }
        val response = mock<Response>()

        val controller = ModellingGroupController({ repo })
        controller.getResponsibilities(request, response)

        verify(repo).getResponsibilities(eq("gId"), eq("tId"), any())
    }
}