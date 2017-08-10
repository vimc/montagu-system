package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.testhelpers.DatabaseTest

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
                    "countries" to array(countries.sortedBy { it }),
                    "genderisapplicable" to false
            )})
        }
    }

    private var countries: List<String> = listOf()
    private var sourceIds: List<Int> = listOf()
    private var sources: List<String> = listOf("UNWPP2015", "UNWPP2017")
    private var variantIds: List<Int> = listOf()
    private var variants = listOf("low", "medium", "high")
    private var units: List<Int> = listOf()

    private fun setUpSupportingTables(it: JooqContext)
    {
        countries = it.generateCountries(3)
        sourceIds = it.generateDemographicSources(sources)
        variantIds = it.generateDemographicVariants(variants)
        units = it.generateDemographicUnits()
        it.generateGenders()
    }

    private fun setUpTouchstone(it: JooqContext){
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)
        it.addTouchstoneCountries(touchstoneId, countries)
    }

    private fun addPopulation(it: JooqContext)
    {
        val pop = it.addDemographicStatisticType("tot-pop", variantIds, units)

        it.generateDemographicData(sourceIds.first(), pop, genderId = 1,
                variantId = variantIds.first(), countries = countries)
    }
}