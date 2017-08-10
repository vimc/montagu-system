package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.TouchstoneStatus

class GetDemographicsTests : TouchstoneRepositoryTests()
{
    private var countries: List<String> = listOf()
    private var sourceIds: List<Int> = listOf()
    private var sources: List<String> = listOf("UNWPP2015", "UNWPP2017")
    private var variantIds: List<Int> = listOf()
    private var variants = listOf("unwpp_estimates", "unwpp_low_variant", "unwpp_medium_variant", "unwpp_high_variant")
    private var units: List<Int> = listOf()

    private fun setUpSupportingTables(it: JooqContext)
    {
        countries = it.generateCountries(3)
        sourceIds = it.generateDemographicSources(sources)
        variantIds = it.generateDemographicVariants(variants)
        units = it.generateDemographicUnits()
        it.generateGenders()
    }

    private fun setUpTouchstone(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)
        it.addTouchstoneCountries(touchstoneId, countries)
    }

    private fun addPopulation(it: JooqContext,
                              sources: List<Int> = sourceIds,
                              variants: List<Int> = variantIds,
                              countries: List<String> = this.countries)
    {
        val pop = it.addDemographicStatisticType("tot-pop", variantIds, units)

        for (source in sources)
        {
            for (variant in variants)
            {
                it.generateDemographicData(source, pop, genderId = 1,
                        variantId = variant, countries = countries, yearRange = 1950..2050 step 5)
            }
        }
    }

    private fun addFertility(it: JooqContext)
    {
        val fert = it.addDemographicStatisticType("as-fert", variantIds, units, "age of mother", true)

        it.generateDemographicData(sourceIds.first(), fert, genderId = 1,
                variantId = variantIds.first(), countries = countries)

        it.generateDemographicData(sourceIds.first(), fert, genderId = 1,
                variantId = variantIds[1], countries = countries)

    }

    @Test
    fun `no demographic statistic types are returned if touchstone has no countries()`()
    {
        given {

            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)

            addFertility(it)
            addPopulation(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types).isEmpty()
        }
    }

    @Test
    fun `no demographic statistic types are returned if touchstone has no sources()`()
    {
        given {

            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addTouchstoneCountries(touchstoneId, countries)

            addFertility(it)
            addPopulation(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types).isEmpty()
        }
    }

    @Test
    fun `can fetch demographic statistic types in touchstone`()
    {
        given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            addFertility(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types.count()).isEqualTo(2)
        }
    }

    @Test
    fun `only gets statistic types for touchstone countries()`()
    {
        given {

            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addTouchstoneCountries(touchstoneId, countries.subList(0, 1))
            it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)

            addFertility(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types[0].countries).isEqualTo(countries.subList(0, 1))
        }
    }

    @Test
    fun `gets demographic statistic type properties`()
    {
        given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            addFertility(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)

            val fertilityType = types.sortedBy { it.name }.first()
            Assertions.assertThat(fertilityType.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(fertilityType.id).isEqualTo("as-fert")
            Assertions.assertThat(fertilityType.genderIsApplicable).isTrue()
            Assertions.assertThat(fertilityType.source).isEqualTo(sources.first() + " descriptive name")
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(countries)

            val populationType = types.sortedBy { it.name }[1]
            Assertions.assertThat(populationType.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(populationType.id).isEqualTo("tot-pop")
            Assertions.assertThat(populationType.genderIsApplicable).isFalse()
            Assertions.assertThat(populationType.source).isEqualTo(sources.first() + " descriptive name")
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(countries)
        }
    }

    @Test
    fun `gets touchstone metadata`()
    {
        given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            addFertility(it)

        } check {
            val touchstone = it.getDemographicDataset("tot-pop", touchstoneId).structuredMetadata.touchstone
            Assertions.assertThat(touchstone.name).isEqualTo(touchstoneName)
            Assertions.assertThat(touchstone.description).isEqualTo("Description")
            Assertions.assertThat(touchstone.status).isEqualTo(TouchstoneStatus.OPEN)
            Assertions.assertThat(touchstone.version).isEqualTo(touchstoneVersion)
        }
    }

    @Test
    fun `gets right number of demographic rows`()
    {
        given {
            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)

            // add first 2 sources to touchstone
            val sourcesInTouchstone = sourceIds.subList(0, 1)
            it.addDemographicSourcesToTouchstone(touchstoneId, sourcesInTouchstone)

            // add first 3 countries to touchstone
            val countriesInTouchstone = countries.subList(0, 3)
            it.addTouchstoneCountries(touchstoneId, countriesInTouchstone)

            // add population data for a source that is in the touchstone
            addPopulation(it, sources = sourcesInTouchstone.subList(0, 1))

            // add data for another stat type
            addFertility(it)

            // add data for a source that isn't in the touchstone
            addPopulation(it, sources = sourceIds.subList(1, 2))

        } check {

            val data = it.getDemographicDataset("tot-pop", touchstoneId).tableData.data

            val numYears = 21
            val numAges = 17
            val numCountries = 3

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2
            val numSources = 1
            Assertions.assertThat(data.count()).isEqualTo(numAges * numYears * numCountries * numVariants * numSources)
        }
    }

    @Test
    fun `demographic data is null if no rows`()
    {
        given {
            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)

            // add first 2 sources to touchstone
            it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds.subList(0, 2))

            it.addTouchstoneCountries(touchstoneId, countries)

            // add data for another stat type
            addFertility(it)

            // add data for all countries, multiple variants and a source that isn't in the touchstone
            addPopulation(it, sourceIds.subList(2, 3))

        } check {

            val result = it.getDemographicDataset("tot-pop", touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }
}