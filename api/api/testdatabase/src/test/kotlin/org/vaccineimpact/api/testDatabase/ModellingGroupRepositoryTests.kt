package org.vaccineimpact.api.testDatabase

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqContext
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.db.Tables.MODELLING_GROUP

class ModellingGroupRepositoryTests : DatabaseTest()
{
    fun makeRepository(): ModellingGroupRepository
    {
        val touchstoneRepository = mock<TouchstoneRepository>()
        return JooqModellingGroupRepository({ touchstoneRepository })
    }

    @Test
    fun `can get all modelling groups`()
    {
        JooqContext().use {
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID1"; description = "Description1" }.store()
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID2"; description = "Description2" }.store()
        }
         makeRepository().use { repo ->
             val groups = repo.getModellingGroups()
             assertThat(groups).hasSameElementsAs(listOf(
                     ModellingGroup("ID1", "Description1"),
                     ModellingGroup("ID2", "Description2")
             ))
         }
    }

    @Test
    fun `only most recent version of modelling groups is returned`()
    {
        JooqContext().use {
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID1_v2"; description = "Description1_v2"; current = null }.store()
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID1_v1"; description = "Description1_v1"; current = "ID1_v2" }.store()
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID2"; description = "Description2" }.store()
        }
        makeRepository().use { repo ->
            val groups = repo.getModellingGroups()
            assertThat(groups).hasSameElementsAs(listOf(
                    ModellingGroup("ID1_v2", "Description1_v2"),
                    ModellingGroup("ID2", "Description2")
            ))
        }
    }
}