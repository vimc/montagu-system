package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class DemographicTests: DatabaseTest()
{
    val requiredPermissions = PermissionSet("*/can-login", "*/touchstones.read", "*/demographics.read")
    val touchstoneId = "touchstone-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1

    @Test
    fun `can get demographic stat types for touchstone`()
    {
        validate("/touchstones/$touchstoneId/demographics/") against "Demographics" given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)

        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(1)
            Assertions.assertThat(it).contains(json { obj(
                    "id" to "tot-pop",
                    "name" to "tot-pop descriptive name",
                    "source" to "UNWPP2015 descriptive name",
                    "variants" to array("low"),
                    "countries" to array(_countries.sortedBy { it }),
                    "gender_is_applicable" to false
            )})
        }
    }

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
}