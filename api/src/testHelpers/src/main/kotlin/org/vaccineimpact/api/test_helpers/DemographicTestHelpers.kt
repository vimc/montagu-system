package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

class DemographicDummyData(val it: JooqContext,
                           val touchstoneName: String,
                           val touchstoneVersion: Int,
                           source: String? = null,
                           variants: List<String>? = null,
                           numCountries: Int = 1,
                           val diseases: List<String> = listOf("measles", "hepB"))
{
    val countries: List<String> = it.fetchCountries(numCountries)
    val source: String = source ?: "unwpp2015"
    val sourceId: Int = it.generateDemographicSource(this.source)
    val variants = variants
            ?: listOf("unwpp_estimates", "unwpp_low_variant", "unwpp_medium_variant", "unwpp_high_variant")
    val variantIds: List<Int> = it.generateDemographicVariants(this.variants)
    val peopleUnitId: Int = it.fetchDemographicUnitId("Number of people")
    val birthsUnitId: Int = it.fetchDemographicUnitId("Births per woman")
    val genders: List<Int> = it.fetchGenders()
    val fert = it.addDemographicStatisticType("as-fert", variantIds, birthsUnitId, "age of mother", true)
    val pop = it.addDemographicStatisticType("tot-pop", variantIds, peopleUnitId, genderIsApplicable = false)

    init
    {
        for (disease in diseases)
        {
            it.addDisease(disease, disease)
        }
    }

    fun withTouchstone(countries: List<String>? = null): DemographicDummyData
    {
        it.addTouchstone(this.touchstoneName, this.touchstoneVersion, addName = true)

        for (disease in diseases)
        {
            it.addTouchstoneCountries("$touchstoneName-$touchstoneVersion", countries ?: this.countries, disease)
        }

        return this
    }

    fun withPopulation(source: Int = sourceId,
                       variants: List<Int> = variantIds,
                       countries: List<String> = this.countries,
                       yearRange: IntProgression = 1950..1970 step 5,
                       ageRange: IntProgression = 10..30 step 5,
                       addDataset: Boolean = true): DemographicDummyData
    {
        for (variant in variants)
        {
            for (gender in genders)
            {
                it.generateDemographicData(
                        source,
                        pop,
                        gender,
                        variantId = variant,
                        countries = countries,
                        yearRange = yearRange,
                        ageRange = ageRange)
            }

        }

        if (addDataset)
        {
            it.addDemographicDatasetsToTouchstone("$touchstoneName-$touchstoneVersion", source, pop)
        }
        return this
    }

    fun withFertility(source: Int = sourceId,
                      variants: List<Int> = variantIds,
                      countries: List<String> = this.countries,
                      yearRange: IntProgression = 1950..1970 step 5,
                      ageRange: IntProgression = 10..30 step 5,
                      addDataset: Boolean = true): DemographicDummyData
    {
        for (variant in variants)
        {
            for (gender in genders)
            {
                it.generateDemographicData(source,
                        fert,
                        gender,
                        variantId = variant,
                        countries = countries,
                        yearRange = yearRange,
                        ageRange = ageRange)
            }

        }

        if (addDataset)
        {
            it.addDemographicDatasetsToTouchstone("$touchstoneName-$touchstoneVersion", source, fert)
        }

        return this

    }
}