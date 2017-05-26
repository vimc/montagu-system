package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.test_helpers.MontaguTests

abstract class ControllerTests : MontaguTests()
{
    protected inline fun <reified TRepository : Any> mockControllerContext(
            repository: TRepository,
            crossinline chooseRepo: (Repositories) -> (() -> TRepository)
    )
            : ControllerContext
    {
        val mockRepositories = mock<Repositories> {
            on { chooseRepo(this) } doReturn { repository }
        }
        return mock {
            on { repositories } doReturn mockRepositories
        }
    }
}