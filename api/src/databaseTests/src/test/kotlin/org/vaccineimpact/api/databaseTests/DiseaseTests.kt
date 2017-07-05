package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqSimpleObjectsRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.models.Disease

class DiseaseTests : RepositoryTests<SimpleObjectsRepository>()
{
    @Test
    fun `no diseases are returned if database is empty`()
    {
        givenABlankDatabase().check { repo ->
            val diseases = repo.diseases.all()
            Assertions.assertThat(diseases).isEmpty()
        }
    }

    @Test
    fun `can get diseases`()
    {
        given {
            it.addDisease("cold", "Common cold")
            it.addDisease("hot", "Common hot")
        }.check {
            repo ->
            val diseases = repo.diseases.all()
            Assertions.assertThat(diseases).hasSameElementsAs(listOf(
                    Disease("cold", "Common cold"),
                    Disease("hot", "Common hot")
            ))
        }
    }

    @Test
    fun `can get disease`()
    {
        given {
            it.addDisease("cold", "Common cold")
            it.addDisease("hot", "Common hot")
        }.check {
            repo ->
            val disease = repo.diseases.get("cold")
            Assertions.assertThat(disease).isEqualTo(Disease("cold", "Common cold"))
        }
    }

    override fun makeRepository(db: JooqContext) = JooqSimpleObjectsRepository(db)
}