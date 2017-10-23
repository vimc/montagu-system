package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModelRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
import org.vaccineimpact.api.models.Model

class ModelTests : RepositoryTests<ModelRepository>()
{
    @Test
    fun `no models are returned if database is empty`()
    {
        givenABlankDatabase().check { repo ->
            val models = repo.all()
            Assertions.assertThat(models).isEmpty()
        }
    }

    @Test
    fun `can get models`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)
        }.check {
            repo ->
            val models = repo.all()
            Assertions.assertThat(models).hasSameElementsAs(listOf(
                    Model("fakeId", "some model", "Unknown citation","a"),
                    Model("fakeId2", "another model", "Unknown citation","a")
            ))
        }
    }

    @Test
    fun `can get model`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1")
            it.addDisease("d2")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)
        }.check {
            repo ->
            val model = repo.get("fakeId")
            Assertions.assertThat(model)
                    .isEqualTo(Model("fakeId", "some model", "Unknown citation","a"))
        }
    }

    override fun makeRepository(db: JooqContext) = JooqModelRepository(db.dsl)
}