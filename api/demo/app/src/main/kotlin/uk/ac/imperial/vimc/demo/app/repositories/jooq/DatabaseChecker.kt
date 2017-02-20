package uk.ac.imperial.vimc.demo.app.repositories.jooq

import uk.ac.imperial.vimc.demo.app.errors.DatabaseConfigurationError
import uk.ac.imperial.vimc.demo.app.models.Outcome
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables.OUTCOME

class DatabaseChecker(context: JooqContext)
{
    private val dsl = context.dsl

    fun runChecks()
    {
        checkRequiredOutcomesArePresent()
    }

    private fun checkRequiredOutcomesArePresent()
    {
        val mappedOutcomes = dsl.fetch(OUTCOME)
                .map { it.code }
                .map { Outcome.fromDatabaseCode(it) }
        val missingOutcomes = Outcome.all.subtract(mappedOutcomes)

        if (missingOutcomes.any())
        {
            throw DatabaseConfigurationError("The database is missing the following required outcome codes: $missingOutcomes")
        }
    }
}