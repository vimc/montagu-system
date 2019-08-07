package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModelRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.models.ModelVersion
import org.vaccineimpact.api.models.ResearchModelDetails

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
            it.addDisease("d1", "Disease 1")
            it.addDisease("d2", "Disease 2")
            it.addModel("fakeId", "a", "d1", "some model",
                    genderSpecific = true, gender = "male")
            it.addModel("fakeId2", "a", "d2", "another model",
                    genderSpecific = false, gender = null)


            it.addCountries(listOf("c1", "c2"))

            it.addModelVersion("fakeId", "v1", setCurrent = true, countries=listOf("c1", "c2"))

        }.check {
            repo ->
            val models = repo.all()
            Assertions.assertThat(models).hasSameElementsAs(
                    listOf(
                            ResearchModelDetails("fakeId",
                            "some model",
                            "Unknown citation",
                            "a",
                            Disease("d1", "Disease 1"),
                            genderSpecific = true,
                            gender = "male",
                            currentVersion = ModelVersion(1, "fakeId", "v1", "Some note",
                                    "Some fingerprint", true, "R",
                                    countries=listOf(Country("c1", "c1-Name"), Country("c2", "c2-Name")))),
                            ResearchModelDetails("fakeId2",
                            "another model",
                            "Unknown citation",
                            "a",
                            Disease("d2", "Disease 2"),
                            genderSpecific = false,
                            gender = null,
                            currentVersion = null)
            ))
        }
    }

    @Test
    fun `get models omits models which are not current`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1", "Disease 1")
            it.addModel("fakeId", "a", "d1", "some model",
                    genderSpecific = true, gender = "male")
            it.addModel("fakeId2", "a", "d1", "another model",
                    genderSpecific = false, gender = null, isCurrent = false)

            it.addModelVersion("fakeId", "v1", setCurrent = true)

        }.check {
            repo ->
            val models = repo.all()
            Assertions.assertThat(models).hasSameElementsAs(listOf(
                    ResearchModelDetails("fakeId",
                            "some model",
                            "Unknown citation",
                            "a",
                            Disease("d1", "Disease 1"),
                            genderSpecific = true,
                            gender = "male",
                            currentVersion = ModelVersion(1, "fakeId", "v1", "Some note",
                                    "Some fingerprint", true, "R", countries=listOf()))
            ))
        }
    }

    @Test
    fun `can get model without current version`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1", "Disease 1")
            it.addDisease("d2", "Disease 2")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)
        }.check {
            repo ->
            val model = repo.get("fakeId")
            Assertions.assertThat(model)
                    .isEqualTo(ResearchModelDetails("fakeId", "some model", "Unknown citation","a",
                            Disease("d1", "Disease 1"), false, "both", null))
        }
    }

    @Test
    fun `can get model with current version`()
    {
        given {
            it.addGroup("a", "description a")
            it.addDisease("d1", "Disease 1")
            it.addDisease("d2", "Disease 2")
            it.addModel("fakeId", "a", "d1", "some model")
            it.addModel("fakeId2", "a", "d1", "another model", isCurrent = false)

            it.addCountries(listOf("c1", "c2"))

            it.addModelVersion("fakeId", "v1", setCurrent = false)
            it.addModelVersion("fakeId", "v2", setCurrent = true, countries = listOf("c1", "c2"))
            it.addModelVersion("fakeId2", "v1", setCurrent = true)
        }.check {
            repo ->
            val model = repo.get("fakeId")
            Assertions.assertThat(model)
                    .isEqualTo(ResearchModelDetails("fakeId",
                            "some model",
                            "Unknown citation",
                            "a",
                            Disease("d1", "Disease 1"),
                            false,
                            "both",
                            ModelVersion(2, "fakeId", "v2", "Some note", "Some fingerprint",
                                    true, "R", listOf(Country("c1", "c1-Name"), Country("c2", "c2-Name")))))
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