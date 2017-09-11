package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.models.BurdenEstimateSet
import java.sql.Timestamp
import java.time.Instant

class JooqBurdenEstimateRepository(
        db: JooqContext,
        config: Configuration,
        private val modellingGroupRepository: ModellingGroupRepository
) : JooqRepository(db, config), BurdenEstimateRepository
{
    override fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                      set: BurdenEstimateSet, uploader: String, timestamp: Instant): Int
    {
        val responsibility = modellingGroupRepository.getResponsibility(groupId, touchstoneId, scenarioId)

        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.responsibility = responsibility.id
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
        }
        setRecord.insert()
        val setId = setRecord.id

        val outcomeLookup = dsl.select(BURDEN_OUTCOME.fieldsAsList())
                .from(BURDEN_OUTCOME)
                .fetch()
                .associateBy({ it[BURDEN_OUTCOME.name] }, { it[BURDEN_OUTCOME.ID] })

        val estimates = set.estimates.flatMap { row ->
            row.outcomes.map { outcome ->
                dsl.newRecord(BURDEN_ESTIMATE).apply {
                    burdenEstimateSet = setId
                    country = row.country
                    year = row.year
                    age = row.age
                    stochastic = false
                    burdenOutcome = outcomeLookup[outcome.value]
                    value = outcome.value
                }
            }
        }
        dsl.batchStore(estimates).execute()

        return setId
    }
}