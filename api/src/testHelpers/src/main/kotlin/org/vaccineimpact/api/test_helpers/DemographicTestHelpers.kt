package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

class DemographicDummyData(val it: JooqContext,
                           sources: List<String>? = null,
                           variants: List<String>? = null)
{
    val countries: List<String> = it.generateCountries(1)
    val sources: List<String> = sources ?: listOf("unwpp2015", "unwpp2017")
    val sourceIds: List<Int> = it.generateDemographicSources(this.sources).map { (code, id) -> id }
    val variants = variants ?: listOf("unwpp_estimates", "unwpp_low_variant", "unwpp_medium_variant", "unwpp_high_variant")
    val variantIds: List<Int> = it.generateDemographicVariants(this.variants)
    val units: List<Int> = it.fetchDemographicUnitIds()
    val genders: List<Int> = it.generateGenders()

    init
    {
        it.addDisease("measles", "Measles")
    }

    fun withTouchstone(touchstoneName: String, touchstoneVersion: Int): DemographicDummyData
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone("$touchstoneName-$touchstoneVersion", sourceIds)
        it.addTouchstoneCountries("$touchstoneName-$touchstoneVersion", countries, "measles")

        return this
    }

    fun withPopulation(sources: List<Int> = sourceIds,
                       variants: List<Int> = variantIds,
                       countries: List<String> = this.countries,
                       genderIsApplicable: Boolean = false,
                       yearRange: IntProgression = 1950..1970 step 5,
                       ageRange: IntProgression = 10..30 step 5): DemographicDummyData
    {
        val pop = it.addDemographicStatisticType("tot-pop", variantIds, units, genderIsApplicable = genderIsApplicable)

        for (source in sources)
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
        }

        return this
    }

    fun withFertility(sources: List<Int> = sourceIds,
                      variants: List<Int> = variantIds,
                      countries: List<String> = this.countries,
                      yearRange: IntProgression = 1950..1970 step 5,
                      ageRange: IntProgression = 10..30 step 5): DemographicDummyData
    {
        val fert = it.addDemographicStatisticType("as-fert", variantIds, units, "age of mother", true)

        for (source in sources)
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
        }

        return this

    }
}