package org.vaccineimpact.api.testDatabase

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqContext
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.db.Tables.*

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
        val repo = makeRepository()
        JooqContext().use {
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID1"; description = "Description1"; current = "ID1" }.store()
            it.dsl.newRecord(MODELLING_GROUP).apply { id = "ID2"; description = "Description2"; current = "ID2" }.store()
        }
        val groups = repo.modellingGroups.all()
        assertThat(groups).hasSameElementsAs(listOf(
                ModellingGroup("ID1", "Description1"),
                ModellingGroup("ID2", "Description2")
        ))
    }
}