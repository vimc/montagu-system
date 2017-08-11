package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
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
        it.addDisease("measles", "Measles")
    }

    private fun setUpTouchstone(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)
        it.addTouchstoneCountries(touchstoneId, countries, "measles")
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
                it.generateDemographicData(source, pop, 1,
                        variantId = variant, countries = countries, yearRange = 1950..2050 step 5)
            }
        }
    }

    private fun addFertility(it: JooqContext,
                             sources: List<Int> = sourceIds,
                             variants: List<Int> = variantIds,
                             countries: List<String> = this.countries)
    {
        val fert = it.addDemographicStatisticType("as-fert", variantIds, units, "age of mother", true)

        for (source in sources)
        {
            for (variant in variants)
            {
                it.generateDemographicData(source, fert, genderId = 1,
                        variantId = variant, countries = countries,
                        yearRange = 1950..2000 step 5)

            }
        }

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
            it.addTouchstoneCountries(touchstoneId, countries, "measles")

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
            it.addTouchstoneCountries(touchstoneId, countries.subList(0, 1), "measles")
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
            addFertility(it, sources = sourceIds.subList(0,1))

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)

            val fertilityType = types.sortedBy { it.name }.first()
            Assertions.assertThat(fertilityType.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(fertilityType.id).isEqualTo("as-fert")
            Assertions.assertThat(fertilityType.genderIsApplicable).isTrue()
            Assertions.assertThat(fertilityType.sources).isEqualTo(sources.subList(0,1))
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(countries)

            val populationType = types.sortedBy { it.name }[1]
            Assertions.assertThat(populationType.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(populationType.id).isEqualTo("tot-pop")
            Assertions.assertThat(populationType.genderIsApplicable).isFalse()
            Assertions.assertThat(populationType.sources).isEqualTo(sources)
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
            val touchstone = it.getDemographicDataset("tot-pop", sources[0], touchstoneId).structuredMetadata.touchstone
            Assertions.assertThat(touchstone.name).isEqualTo(touchstoneName)
            Assertions.assertThat(touchstone.description).isEqualTo("Description")
            Assertions.assertThat(touchstone.status).isEqualTo(TouchstoneStatus.OPEN)
            Assertions.assertThat(touchstone.version).isEqualTo(touchstoneVersion)
        }
    }

    @Test
    fun `gets demographic dataset metadata`()
    {
        given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            addFertility(it)

        } check {
            var metadata = it.getDemographicDataset("tot-pop", sources[0], touchstoneId)
                    .structuredMetadata.demographicData!!
            Assertions.assertThat(metadata.id).isEqualTo("tot-pop")
            Assertions.assertThat(metadata.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(metadata.gender).isNull()
            Assertions.assertThat(metadata.source).isEqualTo("UNWPP2015 descriptive name")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age")
            Assertions.assertThat(metadata.unit).isEqualTo("people")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)

            metadata = it.getDemographicDataset("as-fert", sources[0], touchstoneId)
                    .structuredMetadata.demographicData!!
            Assertions.assertThat(metadata.id).isEqualTo("as-fert")
            Assertions.assertThat(metadata.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(metadata.gender).isEqualTo("")
            Assertions.assertThat(metadata.source).isEqualTo("UNWPP2015 descriptive name")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age of mother")
            Assertions.assertThat(metadata.unit).isEqualTo("people")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)
        }
    }

    @Test
    fun `gets demographic data`()
    {
        given {

            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            addFertility(it)

        } check {

            val data = it.getDemographicDataset("tot-pop", sources[0], touchstoneId)
                    .tableData.data

            // 1950..2050 step 5 means 21 year steps
            var numYears = 21

            // 0..80 step 5 means 17 age steps
            val numAges = 17

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2

            // should return data for a single source
            val numSources = 1
            val numCountries = countries.count()

            Assertions.assertThat(data.count()).isEqualTo(numAges * numYears * numCountries * numVariants * numSources)

            val fertilityData = it.getDemographicDataset("as-fert", sources[0], touchstoneId)
                    .tableData.data

            // 1950..2000 step 5 means 21 year steps
            numYears = 11

            Assertions.assertThat(fertilityData.count())
                    .isEqualTo(numAges * numYears * numCountries * numVariants * numSources)

        }
    }

    @Test
    fun `throws unknown object error if touchstone doesn't exist`()
    {
        given {
            setUpSupportingTables(it)

        } check {

            Assertions.assertThatThrownBy {
                it.getDemographicDataset("tot-pop", sources[1], touchstoneId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `only returns data for given source`()
    {
        given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it, sourceIds.subList(0, 1))

        } check {

            val source = sources[1]
            val result = it.getDemographicDataset("tot-pop", source, touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for given type`()
    {
        given {

            setUpSupportingTables(it)
            setUpTouchstone(it)
            addFertility(it)

        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for given touchstone countries`()
    {
        val anotherTouchstoneName = "anothertouchstone"
        val anotherTouchstoneId = "$anotherTouchstoneName-$touchstoneVersion"

        given {

            setUpSupportingTables(it)
            setUpTouchstone(it)

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, addName = true, addStatus = false)
            it.addDemographicSourcesToTouchstone(anotherTouchstoneId, sourceIds)
            it.addTouchstoneCountries(anotherTouchstoneId, it.generateCountries(2), "measles")

            addPopulation(it)

        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for source in given touchstone`()
    {
        val anotherTouchstoneName = "anothertouchstone"
        val anotherTouchstoneId = "$anotherTouchstoneName-$touchstoneVersion"

        given {

            setUpSupportingTables(it)
            setUpTouchstone(it)

            val newSources = listOf("anothersource", "moresource")
            val newSourceIds = it.generateDemographicSources(newSources)

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, addName = true, addStatus = false)
            it.addDemographicSourcesToTouchstone(anotherTouchstoneId, newSourceIds)
            it.addTouchstoneCountries(anotherTouchstoneId, countries, "measles")

            addPopulation(it)

        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

}