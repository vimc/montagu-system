package org.vaccineimpact.api.testDatabase

import com.nhaarman.mockito_kotlin.mock
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqContext
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.db.Tables.MODELLING_GROUP

abstract class ModellingGroupRepositoryTests : DatabaseTest()
{
    protected fun withRepositoryAndGroups(populateDatabase: (JooqContext) -> Unit, withRepository: (ModellingGroupRepository) -> Unit)
    {
        JooqContext().use { populateDatabase(it) }
        makeRepository().use { withRepository(it) }
    }

    protected fun makeRepository(): ModellingGroupRepository
    {
        val touchstoneRepository = mock<TouchstoneRepository>()
        return JooqModellingGroupRepository({ touchstoneRepository })
    }

    protected fun JooqContext.addGroup(id: String, description: String, current: String? = null)
    {
        this.dsl.newRecord(MODELLING_GROUP).apply {
            this.id = id
            this.description = description
            this.current = current
        }.store()
    }
}