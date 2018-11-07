package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.models.BurdenEstimateWithRunId

// This passes through the original sequence without affecting it, and the
// sequence remains lazily evaluated, but as the elements "pass through"
// this function, we check that they are for the same disease and are expected rows.
// Note that the exception will originate from whatever part of the program is currently
// asking for another element from the sequence, not from the caller of
// this function.
fun Sequence<BurdenEstimateWithRunId>.validate(expectedRows: HashMap<String, HashMap<Int, HashMap<Int, Boolean>>>
): Sequence<BurdenEstimateWithRunId>
{
    var first: BurdenEstimateWithRunId? = null
    return this.onEach {
        first = first ?: it
        if (first!!.disease != it.disease)
        {
            throw InconsistentDataError("More than one value was present in the disease column")
        }

        val ages = expectedRows[it.country]
                ?: throw BadRequest("We are not expecting data for country ${it.country}")

        val years = ages[it.age]
                ?: throw BadRequest("We are not expecting data for age ${it.age}")

        if (!years.containsKey(it.year)) {
            throw BadRequest("We are not expecting data for age ${it.age} and year ${it.year}")
        }

        if (years[it.year]!!){
            throw InconsistentDataError("Duplicate row: ${it.country} ${it.age} ${it.year}")
        }

        expectedRows[it.country]!![it.age]!![it.year] = true
    }
}


// TODO actually validate rows, based on runId as well as year/age/country
fun Sequence<BurdenEstimateWithRunId>.validateStochastic(): Sequence<BurdenEstimateWithRunId>
{
    var first: BurdenEstimateWithRunId? = null
    return this.onEach {
        first = first ?: it
        if (first!!.disease != it.disease)
        {
            throw InconsistentDataError("More than one value was present in the disease column")
        }
    }
}