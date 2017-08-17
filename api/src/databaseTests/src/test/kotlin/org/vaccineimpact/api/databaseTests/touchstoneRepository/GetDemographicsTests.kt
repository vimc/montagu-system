package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.test_helpers.DemographicDummyData

class GetDemographicsTests : TouchstoneRepositoryTests()
{
    val sources: List<String> = listOf("unwpp2015", "unwpp2017")

    @Test
    fun `no demographic statistic types are returned if touchstone has no countries()`()
    {
        given {

            val sourceIds = DemographicDummyData(it)
                    .withPopulation()
                    .withFertility()
                    .sourceIds

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)


        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types).isEmpty()
        }
    }

    @Test
    fun `no demographic statistic types are returned if touchstone has no sources()`()
    {
        given {

            val countries = DemographicDummyData(it)
                    .withPopulation()
                    .withFertility()
                    .countries

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addTouchstoneCountries(touchstoneId, countries, "measles")


        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types).isEmpty()
        }
    }

    @Test
    fun `can fetch demographic statistic types in touchstone`()
    {
        given {
            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .withFertility()

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types.count()).isEqualTo(2)
        }
    }

    @Test
    fun `only gets statistic types for touchstone countries()`()
    {
        var expectedCountries: List<String> = listOf()

        given {

            val data = DemographicDummyData(it)
                    .withPopulation()
                    .withFertility()

            expectedCountries = data.countries.subList(0, 1)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addTouchstoneCountries(touchstoneId, expectedCountries, "measles")
            it.addDemographicSourcesToTouchstone(touchstoneId, data.sourceIds)


        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types[0].countries).isEqualTo(expectedCountries)
        }
    }

    @Test
    fun `gets demographic statistic type properties`()
    {
        var expectedCountries: List<String> = listOf()
        val expectedPopulationSources: List<String> = sources
        val expectedFertilitySources: List<String> = sources.subList(0, 1)

        given {
            val data = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()

            expectedCountries = data.countries

            data.withFertility(sources = data.sourceIds.subList(0, 1))


        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)

            val fertilityType = types.sortedBy { it.name }.first()
            Assertions.assertThat(fertilityType.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(fertilityType.id).isEqualTo("as-fert")
            Assertions.assertThat(fertilityType.genderIsApplicable).isTrue()
            Assertions.assertThat(fertilityType.sources).isEqualTo(expectedFertilitySources)
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(expectedCountries)

            val populationType = types.sortedBy { it.name }[1]
            Assertions.assertThat(populationType.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(populationType.id).isEqualTo("tot-pop")
            Assertions.assertThat(populationType.genderIsApplicable).isFalse()
            Assertions.assertThat(populationType.sources).isEqualTo(expectedPopulationSources)
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(expectedCountries)
        }
    }

    @Test
    fun `gets touchstone metadata`()
    {
        given {
            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .withFertility()

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
        var countries: List<String> = listOf()

        given {

            countries = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .withFertility()
                    .countries

        } check {
            var metadata = it.getDemographicDataset("tot-pop", sources[0], touchstoneId)
                    .structuredMetadata.demographicData

            Assertions.assertThat(metadata.id).isEqualTo("tot-pop")
            Assertions.assertThat(metadata.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(metadata.gender).isEqualTo("both")
            Assertions.assertThat(metadata.source).isEqualTo("unwpp2015 descriptive name")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age")
            Assertions.assertThat(metadata.unit).isEqualTo("people")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)

            metadata = it.getDemographicDataset("as-fert", sources[0], touchstoneId)
                    .structuredMetadata.demographicData

            Assertions.assertThat(metadata.id).isEqualTo("as-fert")
            Assertions.assertThat(metadata.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(metadata.gender).isEqualTo("both")
            Assertions.assertThat(metadata.source).isEqualTo("unwpp2015 descriptive name")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age of mother")
            Assertions.assertThat(metadata.unit).isEqualTo("people")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)
        }
    }


    @Test
    fun `gets demographic data`()
    {
        var countries: List<String> = listOf()

        given {

            countries = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)
                    .withFertility(yearRange = 1950..1960 step 5, ageRange = 10..15 step 5)
                    .countries

        } check {

            val data = it.getDemographicDataset("tot-pop", sources[0], touchstoneId)
                    .tableData.data

            var numYears = 2
            val numAges = 2

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2

            val numCountries = countries.count()

            Assertions.assertThat(data.count()).isEqualTo(numAges * numYears * numCountries * numVariants)

            val fertilityData = it.getDemographicDataset("as-fert", sources[0], touchstoneId)
                    .tableData.data

            numYears = 3

            Assertions.assertThat(fertilityData.count())
                    .isEqualTo(numAges * numYears * numCountries * numVariants)

        }
    }

    @Test
    fun `throws unknown object error if touchstone doesn't exist`()
    {
        given {

           DemographicDummyData(it, sources)

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
            val data = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withFertility()

            data.withPopulation(data.sourceIds.subList(0, 1))

        } check {

            val source = sources[1]
            val result = it.getDemographicDataset("tot-pop", source, touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.structuredMetadata.demographicData.source).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for given type`()
    {
        given {

            DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withFertility()

        } check {

            Assertions.assertThatThrownBy { it.getDemographicDataset("tot-pop", sources[1], touchstoneId) }
                    .isInstanceOf(UnknownObjectError::class.java)

        }
    }

    @Test
    fun `only returns data for standard variants`()
    {
        given {

            DemographicDummyData(it, sources, listOf("unwpp_low_variant", "fake_variant", "unwpp_high_variant"))
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()

        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.structuredMetadata.demographicData.source).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for given touchstone countries`()
    {
        val anotherTouchstoneName = "anothertouchstone"
        val anotherTouchstoneId = "$anotherTouchstoneName-$touchstoneVersion"

        given {

            val sourceIds = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .sourceIds

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, addName = true, addStatus = false)
            it.addDemographicSourcesToTouchstone(anotherTouchstoneId, sourceIds)
            it.addTouchstoneCountries(anotherTouchstoneId, it.generateCountries(2), "measles")


        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.structuredMetadata.demographicData.source).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `only returns data for source in given touchstone`()
    {
        val anotherTouchstoneName = "anothertouchstone"
        val anotherTouchstoneId = "$anotherTouchstoneName-$touchstoneVersion"

        given {

            val countries = DemographicDummyData(it, sources)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .countries

            val newSources = listOf("anothersource", "moresource")
            val newSourceIds = it.generateDemographicSources(newSources)

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, addName = true, addStatus = false)
            it.addDemographicSourcesToTouchstone(anotherTouchstoneId, newSourceIds)
            it.addTouchstoneCountries(anotherTouchstoneId, countries, "measles")


        } check {

            val result = it.getDemographicDataset("tot-pop", sources[1], anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

}