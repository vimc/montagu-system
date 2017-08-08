package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

class GetDemographicsTests : TouchstoneRepositoryTests()
{
    private var _countries: List<String> = listOf()
    private var _sourceIds: List<Int> = listOf()
    private var _sources: List<String> = listOf("UNWPP2015", "UNWPP2017")
    private var _variantIds: List<Int> = listOf()
    private var _variants = listOf("low", "medium", "high")
    private var _units: List<Int> = listOf()

    private fun setUpSupportingTables(it: JooqContext)
    {
        _countries = it.generateCountries(3)
        _sourceIds = it.generateDemographicSources(_sources)
        _variantIds = it.generateDemographicVariants(_variants)
        _units = it.generateDemographicUnits()
        it.generateGenders()
    }

    private fun setUpTouchstone(it: JooqContext){
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone(touchstoneId, _sourceIds)
        it.addTouchstoneCountries(touchstoneId, _countries)
    }

    private fun addPopulation(it: JooqContext)
    {
        val pop = it.addDemographicStatisticType("tot-pop", _variantIds, _units)

        it.generateDemographicData(_sourceIds.first(), pop, genderId = 1,
                variantId = _variantIds.first(), countries = _countries)
    }

    private fun addFertility(it: JooqContext)
    {
        val fert = it.addDemographicStatisticType("as-fert", _variantIds, _units, "age of mother", true)

        it.generateDemographicData(_sourceIds.first(), fert, genderId = 1,
                variantId = _variantIds.first(), countries = _countries)

        it.generateDemographicData(_sourceIds.first(), fert, genderId = 1,
                variantId = _variantIds[1], countries = _countries)

        it.generateDemographicData(_sourceIds.first(), fert, genderId = 1,
                variantId = _variantIds[2], countries = _countries)
    }

    @Test
    fun `no demographic statistic types are returned if touchstone has no countries()`()
    {
        given {

            setUpSupportingTables(it)

            it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
            it.addDemographicSourcesToTouchstone(touchstoneId, _sourceIds)

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
            it.addTouchstoneCountries(touchstoneId, _countries)

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
            it.addTouchstoneCountries(touchstoneId, _countries.subList(0,1))
            it.addDemographicSourcesToTouchstone(touchstoneId, _sourceIds)

            addFertility(it)

        } check {
            val types = it.getDemographicStatisticTypes(touchstoneId)
            Assertions.assertThat(types[0].countries).isEqualTo(_countries.subList(0,1))
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
            Assertions.assertThat(fertilityType.isByGender).isTrue()
            Assertions.assertThat(fertilityType.source).isEqualTo(_sources.first() + " descriptive name")
            Assertions.assertThat(fertilityType.variants).hasSameElementsAs(_variants)
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(_countries)

            val populationType = types.sortedBy { it.name }[1]
            Assertions.assertThat(populationType.name).isEqualTo("tot-pop descriptive name")
            Assertions.assertThat(populationType.id).isEqualTo("tot-pop")
            Assertions.assertThat(populationType.isByGender).isFalse()
            Assertions.assertThat(populationType.source).isEqualTo(_sources.first() + " descriptive name")
            Assertions.assertThat(populationType.variants).hasSameElementsAs(_variants)
            Assertions.assertThat(fertilityType.countries).hasSameElementsAs(_countries)
        }
    }
}