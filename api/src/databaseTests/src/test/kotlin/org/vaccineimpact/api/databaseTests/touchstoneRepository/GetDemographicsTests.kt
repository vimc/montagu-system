package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.test_helpers.DemographicDummyData

class GetDemographicsTests : TouchstoneRepositoryTests()
{
    val source: String = "unwpp2015"

    @Test
    fun `no demographic statistic types are returned if touchstone has no datasets()`()
    {
        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation(addDataset = false)
                    .withFertility(addDataset = false)

        } check {
            val types = it.getDemographicDatasets(touchstoneId)
            Assertions.assertThat(types).isEmpty()
        }
    }

    @Test
    fun `can fetch demographic statistic types in touchstone`()
    {
        given {
            DemographicDummyData(it,touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation()
                    .withFertility()

        } check {
            val types = it.getDemographicDatasets(touchstoneId)
            Assertions.assertThat(types.count()).isEqualTo(2)
        }
    }

    @Test
    fun `gets demographic statistic type properties`()
    {
        given {
            DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withPopulation()
                    .withFertility()

        } check {
            val types = it.getDemographicDatasets(touchstoneId)

            val fertilityType = types.sortedBy { it.name }.first()
            Assertions.assertThat(fertilityType.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(fertilityType.id).isEqualTo("as-fert")
            Assertions.assertThat(fertilityType.genderIsApplicable).isTrue()
            Assertions.assertThat(fertilityType.source).isEqualTo(source)

            val populationType = types.sortedBy { it.name }[1]
            Assertions.assertThat(populationType.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(populationType.id).isEqualTo("tot-pop")
            Assertions.assertThat(populationType.genderIsApplicable).isFalse()
            Assertions.assertThat(populationType.source).isEqualTo(source)
        }
    }

    @Test
    fun `gets touchstone metadata`()
    {
        given {
            DemographicDummyData(it,touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation()
                    .withFertility()

        } check {
            val touchstone = it.getDemographicData("tot-pop", source, touchstoneId).structuredMetadata.touchstone
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

            countries = DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withPopulation()
                    .withFertility()
                    .countries

        } check {
            var metadata = it.getDemographicData("tot-pop", source, touchstoneId)
                    .structuredMetadata.demographicData

            Assertions.assertThat(metadata.id).isEqualTo("tot-pop")
            Assertions.assertThat(metadata.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(metadata.gender).isEqualTo("Both")
            Assertions.assertThat(metadata.source).isEqualTo("unwpp2015")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age")
            Assertions.assertThat(metadata.unit).isEqualTo("Number of people")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)

            metadata = it.getDemographicData("as-fert", source, touchstoneId)
                    .structuredMetadata.demographicData

            Assertions.assertThat(metadata.id).isEqualTo("as-fert")
            Assertions.assertThat(metadata.name).isEqualTo("as-fert descriptive name")
            Assertions.assertThat(metadata.gender).isEqualTo("Both")
            Assertions.assertThat(metadata.source).isEqualTo("unwpp2015")
            Assertions.assertThat(metadata.ageInterpretation).isEqualTo("age of mother")
            Assertions.assertThat(metadata.unit).isEqualTo("Births per woman")
            Assertions.assertThat(metadata.countries).hasSameElementsAs(countries)
        }
    }


    @Test
    fun `gets demographic data`()
    {
        var countries: List<String> = listOf()

        given {

            countries = DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withPopulation(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)
                    .withFertility(yearRange = 1950..1960 step 5, ageRange = 10..15 step 5)
                    .countries

        } check {

            val all = it.getDemographicData("tot-pop", source, touchstoneId)
            val data = all
                    .tableData.data

            var numYears = 2
            val numAges = 2

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2

            val numCountries = countries.count()

            Assertions.assertThat(data.count()).isEqualTo(numAges * numYears * numCountries * numVariants)

            val fertilityData = it.getDemographicData("as-fert", source, touchstoneId)
                    .tableData.data

            numYears = 3

            Assertions.assertThat(fertilityData.count())
                    .isEqualTo(numAges * numYears * numCountries * numVariants)

        }
    }

    @Test
    fun `gets both genders if no option provided`()
    {

        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5,
                            ageRange = 10..15 step 5)

        } check {

            val data = it.getDemographicData("as-fert", source, touchstoneId)
            Assertions.assertThat(data.structuredMetadata.demographicData.gender).isEqualTo("Both")
            Assertions.assertThat(data.tableData.data.any { it.gender == "Both" }).isTrue()

        }
    }

    @Test
    fun `gets both genders if gender is not applicable`()
    {

        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withPopulation(yearRange = 1950..1955 step 5,
                            ageRange = 10..15 step 5)

        } check {

            val data = it.getDemographicData("tot-pop", source, touchstoneId, "female")
            Assertions.assertThat(data.structuredMetadata.demographicData.gender).isEqualTo("Both")
            Assertions.assertThat(data.tableData.data.any { it.gender == "Both" }).isTrue()
        }
    }

    @Test
    fun `gets supplied gender if gender is applicable`()
    {

        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5,
                            ageRange = 10..15 step 5)

        } check {

            val data = it.getDemographicData("as-fert", source, touchstoneId, "female")
            Assertions.assertThat(data.structuredMetadata.demographicData.gender).isEqualTo("Female")
            Assertions.assertThat(data.tableData.data.any { it.gender == "Female" }).isTrue()
        }
    }

    @Test
    fun `throws unknown object error if touchstone doesn't exist`()
    {
        given {

           DemographicDummyData(it, touchstoneName, touchstoneVersion, source)

        } check {

            Assertions.assertThatThrownBy {
                it.getDemographicData("tot-pop", source, touchstoneId)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `only returns data for given source`()
    {
        given {
            val newSource = "anothersource"
            val newSourceId = it.generateDemographicSource(newSource)

           DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withFertility()
                    .withPopulation(source = newSourceId, addDataset = false)

        } check {

            val result = it.getDemographicData("tot-pop", source, touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.structuredMetadata.demographicData.source).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)
        }
    }

    @Test
    fun `throws unknown type error for nonexistent type`()
    {
        given {

            it.addDisease("measles", "Measles")
            it.addTouchstone(this.touchstoneName, this.touchstoneVersion, addName = true)
            it.addTouchstoneCountries("$touchstoneName-$touchstoneVersion", it.fetchCountries(1), "measles")

        } check {

            Assertions.assertThatThrownBy { it.getDemographicData("tot-pop", source, touchstoneId) }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .matches { (it as UnknownObjectError).typeName == "demographic-statistic-type" }

        }
    }

    @Test
    fun `only returns data for given type`()
    {
        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withFertility()
        } check {

            val result = it.getDemographicData("tot-pop", source, touchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.structuredMetadata.demographicData.source).isNull()
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)

        }
    }

    @Test
    fun `only returns data for standard variants`()
    {
        given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion, source, listOf("unwpp_low_variant", "fake_variant", "unwpp_high_variant"))
                    .withTouchstone()
                    .withPopulation()

        } check {

            val result = it.getDemographicData("tot-pop", source, touchstoneId)
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
        var countries = emptyList<String>()

        given {
            countries = it.fetchCountries(4)
            val data = DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone(countries)
                    .withPopulation(countries = countries)
                    .withPopulation(countries = countries.take(2), addDataset = false)

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, source, addName = true)
            it.addTouchstoneCountries("$anotherTouchstoneName-$touchstoneVersion", countries.take(2), "measles")
            it.addDemographicDatasetsToTouchstone("$anotherTouchstoneName-$touchstoneVersion", data.sourceId, data.pop)

        } check {
            val expectedCountries = countries.take(2)

            val result = it.getDemographicData("tot-pop", source, anotherTouchstoneId)
            val metadata = result.structuredMetadata.demographicData
            
            assertThat(metadata.countries).isEqualTo(expectedCountries)
            assertThat(metadata.source).isEqualTo(source)
            assertThat(result.tableData.data.map { it.countryCode }.distinct()).isEqualTo(expectedCountries)
        }
    }

    @Test
    fun `only returns data for source in given touchstone`()
    {
        val anotherTouchstoneName = "anothertouchstone"
        val anotherTouchstoneId = "$anotherTouchstoneName-$touchstoneVersion"
        val newSource = "anothersource"

        given {

            val newSourceId = it.generateDemographicSource(newSource)

            val data = DemographicDummyData(it, touchstoneName, touchstoneVersion, source)
                    .withTouchstone()
                    .withPopulation()
                    .withPopulation(source = newSourceId, addDataset = false)

            it.addTouchstone(anotherTouchstoneName, touchstoneVersion, addName = true)
            it.addTouchstoneCountries("$anotherTouchstoneName-$touchstoneVersion", data.countries, "measles")
            it.addDemographicDatasetsToTouchstone("$anotherTouchstoneName-$touchstoneVersion",
                    newSourceId, data.pop)


        } check {

            var result = it.getDemographicData("tot-pop", source, anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isEqualTo(0)
            Assertions.assertThat(result.tableData.data.count()).isEqualTo(0)

            result = it.getDemographicData("tot-pop", newSource, anotherTouchstoneId)
            Assertions.assertThat(result.structuredMetadata.demographicData.countries.count()).isGreaterThan(0)
            Assertions.assertThat(result.tableData.data.count()).isGreaterThan(0)
        }
    }

}