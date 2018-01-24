package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext


class ScenarioTests : RepositoryTests<ModelRepository>()
{
    override fun makeRepository(db: JooqContext): ModelRepository
    {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    @Test
    fun `no models are returned if database is empty`()
    {
        givenABlankDatabase().check { repo ->
            val models = repo.all()
            Assertions.assertThat(models).isEmpty()
        }
    }
}