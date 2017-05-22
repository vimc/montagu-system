package org.vaccineimpact.api.db.direct

import org.apache.commons.lang3.RandomStringUtils
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.db.tables.records.CoverageRecord
import java.math.BigDecimal
import java.util.*

fun JooqContext.addGroup(id: String, description: String, current: String? = null)
{
    this.dsl.newRecord(MODELLING_GROUP).apply {
        this.id = id
        this.description = description
        this.current = current
    }.store()
}

fun JooqContext.addTouchstoneName(id: String, description: String)
{
    this.dsl.newRecord(TOUCHSTONE_NAME).apply {
        this.id = id
        this.description = description
    }.store()
}

fun JooqContext.addTouchstoneStatus(id: String, name: String? = null)
{
    this.dsl.newRecord(TOUCHSTONE_STATUS).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}

fun JooqContext.addTouchstone(
        name: String,
        version: Int,
        description: String = "Description",
        status: String = "open",
        yearRange: IntRange = 1900..2000,
        addName: Boolean = false,
        addStatus: Boolean = false)
{
    if (addName)
    {
        addTouchstoneName(name, description)
    }
    if (addStatus)
    {
        addTouchstoneStatus(status)
    }
    this.dsl.newRecord(TOUCHSTONE).apply {
        this.id = "$name-$version"
        this.touchstoneName = name
        this.version = version
        this.description = description
        this.status = status
        this.yearStart = yearRange.start
        this.yearEnd = yearRange.endInclusive
    }.store()
}

fun JooqContext.addDisease(id: String, name: String? = null)
{
    this.dsl.newRecord(DISEASE).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}

fun JooqContext.addVaccine(id: String, name: String? = null)
{
    this.dsl.newRecord(VACCINE).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}

fun JooqContext.addSupportLevel(id: String, name: String? = null)
{
    this.dsl.newRecord(GAVI_SUPPORT_LEVEL).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}
fun JooqContext.addSupportLevels(vararg ids: String)
{
    ids.forEach { this.addSupportLevel(it) }
}

fun JooqContext.addActivityType(id: String, name: String? = null)
{
    this.dsl.newRecord(ACTIVITY_TYPE).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}
fun JooqContext.addActivityTypes(vararg ids: String)
{
    ids.forEach { this.addActivityType(it) }
}

fun JooqContext.addScenarioDescription(id: String, description: String, disease: String, addDisease: Boolean = false)
{
    if (addDisease)
    {
        addDisease(disease)
    }
    this.dsl.newRecord(SCENARIO_DESCRIPTION).apply {
        this.id = id
        this.description = description
        this.disease = disease
    }.store()
}

fun JooqContext.addScenarioToTouchstone(touchstone: String,
                                        scenarioDescription: String,
                                        id: Int? = null
): Int
{
    return this.dsl.newRecord(SCENARIO).apply {
        if (id != null)
        {
            this.id = id
        }
        this.touchstone = touchstone
        this.scenarioDescription = scenarioDescription
        store()
    }.id
}

fun JooqContext.addScenarios(touchstone: String, vararg scenarioDescriptions: String): List<Int>
{
    return scenarioDescriptions.map { this.addScenarioToTouchstone(touchstone, it) }
}

fun JooqContext.addResponsibilitySetStatus(id: String, name: String? = null)
{
    this.dsl.newRecord(RESPONSIBILITY_SET_STATUS).apply {
        this.id = id
        this.name = name ?: id
    }.store()
}

fun JooqContext.addResponsibilitySet(
        modellingGroup: String,
        touchstone: String,
        status: String,
        addStatus: Boolean = false
): Int
{
    if (addStatus)
    {
        this.addResponsibilitySetStatus(status)
    }
    val record = this.dsl.newRecord(RESPONSIBILITY_SET).apply {
        this.modellingGroup = modellingGroup
        this.touchstone = touchstone
        this.status = status
    }
    record.store()
    return record.id
}

/** Creates both a responsibility, assuming the referenced scenario already exists **/
fun JooqContext.addResponsibility(responsibilitySetId: Int, scenarioId: Int): Int
{
    val record = this.dsl.newRecord(RESPONSIBILITY).apply {
        responsibilitySet = responsibilitySetId
        scenario = scenarioId
    }
    record.store()
    return record.id
}

/** Creates both a responsibility and the scenario it depends on **/
fun JooqContext.addResponsibility(responsibilitySetId: Int, touchstone: String, scenarioDescription: String): Int
{
    val scenarioId = this.addScenarioToTouchstone(touchstone, scenarioDescription)
    return this.addResponsibility(responsibilitySetId, scenarioId)
}

fun JooqContext.addCoverageSet(
        touchstoneId: String,
        name: String,
        vaccine: String,
        supportLevel: String,
        activityType: String,
        id: Int? = null,
        addVaccine: Boolean = false,
        addSupportLevel: Boolean = false,
        addActivityType: Boolean = false
): Int
{
    if (addVaccine)
    {
        this.addVaccine(vaccine)
    }
    if (addSupportLevel)
    {
        this.addSupportLevel(supportLevel)
    }
    if (addActivityType)
    {
        this.addActivityType(activityType)
    }

    val record = this.dsl.newRecord(COVERAGE_SET).apply {
        if (id != null)
        {
            this.id = id
        }
        this.touchstone = touchstoneId
        this.name = name
        this.vaccine = vaccine
        this.gaviSupportLevel = supportLevel
        this.activityType = activityType
    }
    record.store()
    return record.id
}

fun JooqContext.addCoverageSetToScenario(scenarioId: Int, coverageSetId: Int, order: Int): Int
{
    val record = this.dsl.newRecord(SCENARIO_COVERAGE_SET).apply {
        this.scenario = scenarioId
        this.coverageSet = coverageSetId
        this.order = order
    }
    record.store()
    return record.id
}

fun JooqContext.addCoverageSetToScenario(scenarioId: String, touchstoneId: String, coverageSetId: Int, order: Int): Int
{
    val record = this.dsl.select(SCENARIO.ID)
            .fromJoinPath(SCENARIO, SCENARIO_DESCRIPTION)
            .where(SCENARIO.TOUCHSTONE.eq(touchstoneId))
            .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
            .fetchOne()
    return this.addCoverageSetToScenario(record[SCENARIO.ID], coverageSetId, order)
}

fun JooqContext.addCountries(ids: List<String>)
{
    val records = ids.map {
        this.dsl.newRecord(COUNTRY).apply {
            this.id = it
            this.name = "$it-Name"
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.generateCountries(count: Int): List<String>
{
    val countries = (0..count).map {
        RandomStringUtils.randomAlphabetic(3).toUpperCase()
    }
    this.addCountries(countries)
    return countries
}

fun JooqContext.generateCoverageData(
        coverageSetId: Int,
        countryCount: Int = 5,
        yearRange: IntProgression = 1950..2000 step 5,
        ageRange: IntProgression = 0..80 step 5)
{
    val generator = Random()
    val records = mutableListOf<CoverageRecord>()
    val countries = this.generateCountries(countryCount)
    for (country in countries)
    {
        for (year in yearRange)
        {
            for (age in ageRange)
            {
                records.add(this.dsl.newRecord(COVERAGE).apply {
                    this.coverageSet = coverageSetId
                    this.country = country
                    this.year = year
                    this.ageFrom = BigDecimal(age)
                    this.ageTo = BigDecimal(age + ageRange.step)
                    this.ageRangeVerbatim = null
                    this.target = null
                    this.coverage = generator.nextDecimal(0, 100, numberOfDecimalPlaces = 2)
                    this.gaviSupport = false
                })
            }
        }
    }
    this.dsl.batchStore(records).execute()
}