package org.vaccineimpact.api.generateTestData

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*


class DemographicTestData(val db: JooqContext)
{
    val variants = listOf("unwpp_estimates", "unwpp_medium_variant", "unwpp_high_variant")
    val countries = db.generateCountries(3)
    val sources = db.generateDemographicSources(listOf("unwpp2015", "unwpp2017"))
    val variantIds = db.generateDemographicVariants(variants)
    val units = db.fetchDemographicUnitIds()
    val genderIds = db.generateGenders()
    val statisticTypes = addStatisticTypes(listOf(
            "tot-pop" to "Total population",
            "tot-births" to
                    "Total births")
    )

    fun generate(touchstoneId: String, diseases: List<String>)
    {
        db.addDemographicSourcesToTouchstone(touchstoneId, sources.map { (_, id) -> id })
        for (disease in diseases)
        {
            db.addTouchstoneCountries(touchstoneId, countries, disease)
        }

        for ((typeCode, typeId) in statisticTypes)
        {
            for ((_, sourceId) in sources.filter { (code, _) -> sourceIsRelevantToType(code, typeCode) })
            {
                for (gender in genderIds)
                {
                    for (variant in variantIds)
                    {
                        println("Generating demographic data for $touchstoneId/$typeCode/$sourceId/$variant")
                        db.generateDemographicData(sourceId, typeId,
                                genderId = gender,
                                variantId = variant,
                                countries = countries
                        )
                    }
                }
            }
        }
    }

    private fun sourceIsRelevantToType(source: String, type: String) =
            type == "tot-pop" || source == "unwpp2017"

    fun addStatisticTypes(definitions: List<Pair<String, String>>): List<Pair<String, Int>>
    {
        return definitions.withIndex().map { (index, definition) ->
            val (code, name) = definition
            val id = db.addDemographicStatisticType(
                    code,
                    variantIds,
                    units,
                    name = name,
                    genderIsApplicable = index % 2 == 0
            )
            code to id
        }
    }
}