package org.vaccineimpact.api.tests.app_start

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.junit.Test
import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.Router
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.test_helpers.MontaguTests

class RouterTests : MontaguTests()
{
    @Test
    fun `router can invoke action`()
    {
        val router = Router(mock(), mock(), mock(), mock())
        val repo = mock<SimpleObjectsRepository> {
            on { diseases } doReturn InMemoryDataSet(listOf(Disease("d", "Disease")))
        }
        val repos = mock<Repositories> {
            on { simpleObjects } doReturn repo
        }
        router.invokeControllerAction(Endpoint("/", "Disease", "getDiseases"), mock(), repos)
        // If the diseases property was invoked the controller must have been
        // successfully instantiated and the action invoked
        verify(repo).diseases
    }
}