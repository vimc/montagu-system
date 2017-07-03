package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModelRepository
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
            it.addModel("fakeId", "a", "some model")
            it.addModel("fakeId2", "a", "another model")
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
            it.addModel("fakeId", "a", "some model")
            it.addModel("fakeId2", "a", "another model")
        }.check {
            repo ->
            val model = repo.get("fakeId")
            Assertions.assertThat(model)
                    .isEqualTo(Model("fakeId", "some model", "Unknown citation","a"))
        }
    }

    override fun makeRepository() = JooqModelRepository()
}