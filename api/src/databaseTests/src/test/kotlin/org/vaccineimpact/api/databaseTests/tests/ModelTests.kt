package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModelRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
import org.vaccineimpact.api.db.direct.addModelVersion
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.ModelVersion

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
            it.addModel("fakeId", "a", "d1", "some model",
                    genderSpecific = true, gender = "male")
            it.addModel("fakeId2", "a", "d1", "another model",
                    genderSpecific = false, gender = null, isCurrent = false)

            it.addModelVersion("fakeId", "v1")

        }.check {
            repo ->
            val models = repo.all()
            Assertions.assertThat(models).hasSameElementsAs(listOf(
                    Model("fakeId",
                            "some model",
                            "Unknown citation",
                            "a",
                            genderSpecific = true,
                            gender = "male",
                            currentVersion = ModelVersion("1", "fakeId", "v1", "Some note",
                                    "Some fingerprint", true, "R", 100)),
                    Model("fakeId2",
                            "another model",
                            "Unknown citation",
                            "a",
                            genderSpecific = false,
                            gender = null,
                            currentVersion = null)
            ))
        }
    }

    @Test
    fun `can get model without current version`()
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
                    .isEqualTo(Model("fakeId", "some model", "Unknown citation","a",
                            false, "both", null))
        }
    }

    @Test
    fun `can get model with current version`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1")
            it.addDisease("d2")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)
            it.addModelVersion("fakeId", "v1", setCurrentVersion = false)
            it.addModelVersion("fakeId", "v2", setCurrentVersion = true)
            it.addModelVersion("fakeId2", "v1", setCurrentVersion = true)
        }.check {
            repo ->
            val model = repo.get("fakeId")
            Assertions.assertThat(model)
                    .isEqualTo(Model("fakeId",
                            "some model",
                            "Unknown citation",
                            "a",
                            false,
                            "both",
                            ModelVersion(2, "fakeId", "v2", "Some note", "Some fingerprint",
                                    true, "R", 100)))
        }
    }

    @Test
    fun `getting nonexistent model throws UnknownObjectError`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1")
            it.addDisease("d2")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)
        }.check {
            repo ->
            Assertions.assertThatThrownBy { repo.get("fakeId3") }
                    .isInstanceOf(UnknownObjectError::class.java)
        }

    }

    override fun makeRepository(db: JooqContext) = JooqModelRepository(db.dsl)
}