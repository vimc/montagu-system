package org.vaccineimpact.api.generateTestData

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*


class DemographicTestData(val db: JooqContext)
{
    val variants = listOf("unwpp_estimates", "unwpp_medium_variant", "unwpp_high_variant")
    val countries = db.fetchCountries(3)
    val sourceNames = listOf("unwpp2015", "unwpp2017")
    val variantIds = db.generateDemographicVariants(variants)
    val unit = db.fetchDemographicUnitIds().first()
    val genderIds = db.fetchGenders()
    val statisticTypes = addStatisticTypes(listOf(
            "tot-pop" to "Total population",
            "tot-births" to
                    "Total births")
    )

    fun generate(touchstoneVersionId: String, diseases: List<String>)
    {
        val sources = sourceNames.map { Pair<String, Int>(it, db.generateDemographicSource(it)) }

        for (disease in diseases)
        {
            db.addTouchstoneCountries(touchstoneVersionId, countries, disease)
        }

        for ((typeCode, typeId) in statisticTypes)
        {
            for ((_, sourceId) in sources.filter { (code, _) -> sourceIsRelevantToType(code, typeCode) })
            {
                for (gender in genderIds)
                {
                    for (variant in variantIds)
                    {
                        println("Generating demographic data for $touchstoneVersionId/$typeCode/$sourceId/$variant")
                        db.generateDemographicData(sourceId, typeId,
                                genderId = gender,
                                variantId = variant,
                                countries = countries
                        )
                    }
                }

                db.addDemographicDatasetsToTouchstone(touchstoneVersionId, sourceId, typeId)
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
                    unit,
                    name = name,
                    genderIsApplicable = index % 2 == 0
            )
            code to id
        }
    }
}