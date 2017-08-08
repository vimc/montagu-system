package org.vaccineimpact.api.db.direct

import org.apache.commons.lang3.RandomStringUtils
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.db.tables.records.CoverageRecord
import org.vaccineimpact.api.db.tables.records.DemographicSourceRecord
import org.vaccineimpact.api.db.tables.records.DemographicStatisticRecord
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.ensureUserHasRole
import java.math.BigDecimal
import java.sql.Timestamp
import java.util.*

private val random = Random(0)

fun JooqContext.addGroup(id: String, description: String = id, current: String? = null)
{
    this.dsl.newRecord(MODELLING_GROUP).apply {
        this.id = id
        this.description = description
        this.current = current
        this.institution = "Some institution"
        this.pi = "Some PI"
    }.store()
}

fun JooqContext.addModel(
        id: String,
        groupId: String,
        description: String = id,
        citation: String = "Unknown citation",
        current: String? = null
)
{
    this.dsl.newRecord(MODEL).apply {
        this.id = id
        this.modellingGroup = groupId
        this.description = description
        this.citation = citation
        this.current = current
    }.store()
}

fun JooqContext.addTouchstoneName(id: String, description: String)
{
    this.dsl.newRecord(TOUCHSTONE_NAME).apply {
        this.id = id
        this.description = description
        this.comment = "Comment"
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
        this.comment = "Comment"
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

fun JooqContext.addTouchstoneCountries(touchstoneId: String, ids: List<String>)
{
    addDisease("Measles", "Measles")

    val records = ids.map {
        this.dsl.newRecord(TOUCHSTONE_COUNTRY).apply {
            this.touchstone = touchstoneId
            this.country = it
            this.disease = "Measles"
        }
    }
    this.dsl.batchStore(records).execute()
}


fun JooqContext.generateDemographicSources(sources: List<String>): List<Int>
{
    val records = sources.map {
        this.dsl.newRecord(DEMOGRAPHIC_SOURCE).apply {
            this.code = it
            this.name = "$it descriptive name"
        }
    }
    this.dsl.batchStore(records).execute()

    // JOOQ batchStore doesn't populate generated keys (https://github.com/jOOQ/jOOQ/issues/3327)
    // so have to read these back out
    return this.dsl.select(DEMOGRAPHIC_SOURCE.ID)
            .from(DEMOGRAPHIC_SOURCE)
            .fetchInto(Int::class.java)
}

fun JooqContext.generateDemographicVariants(variants: List<String>): List<Int>
{
    val records = variants.map {
        this.dsl.newRecord(DEMOGRAPHIC_VARIANT).apply {
            this.code = it
            this.name = it
        }
    }
    this.dsl.batchStore(records).execute()

    // JOOQ batchStore doesn't populate generated keys (https://github.com/jOOQ/jOOQ/issues/3327)
    // so have to read these back out
    return this.dsl.select(DEMOGRAPHIC_VARIANT.ID)
            .from(DEMOGRAPHIC_VARIANT)
            .fetchInto(Int::class.java)
}

fun JooqContext.generateDemographicUnits(): List<Int>
{
    val sources = listOf("people", "deaths", "births per mother")
    val records = sources.map {
        this.dsl.newRecord(DEMOGRAPHIC_VALUE_UNIT).apply {
            this.name = it
        }
    }
    this.dsl.batchStore(records).execute()

    // JOOQ batchStore doesn't populate generated keys (https://github.com/jOOQ/jOOQ/issues/3327)
    // so have to read these back out
    return this.dsl.select(DEMOGRAPHIC_VALUE_UNIT.ID)
            .from(DEMOGRAPHIC_VALUE_UNIT)
            .fetchInto(Int::class.java)
}

fun JooqContext.generateGenders()
{
    val sources = listOf("M", "F", "B")
    val records = sources.map {
        this.dsl.newRecord(GENDER).apply {
            this.name = it
            this.code = it
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.addDemographicStatisticType(type: String,
                                            variants: List<Int>,
                                            units: List<Int>,
                                            ageInterpretation: String = "age",
                                            genderIsApplicable: Boolean = false,
                                            yearStepSize: Int = 5): Int
{
    val record = this.dsl.newRecord(DEMOGRAPHIC_STATISTIC_TYPE).apply {
        this.code = type
        this.name = "$type descriptive name"
        this.defaultVariant = variants.first()
        this.demographicValueUnit = units.first()
        this.genderIsApplicable = genderIsApplicable
        this.ageInterpretation = ageInterpretation
        this.yearStepSize = yearStepSize
        this.referenceDate = java.sql.Date(System.currentTimeMillis())
    }

    record.store()

    val variantRecords = variants.map {
        this.dsl.newRecord(DEMOGRAPHIC_STATISTIC_TYPE_VARIANT).apply {
            this.demographicStatisticType = record.id
            this.demographicVariant = it
        }
    }

    this.dsl.batchStore(variantRecords).execute()

    return record.id
}

fun JooqContext.generateDemographicData(
        sourceId: Int,
        typeId: Int,
        genderId: Int,
        variantId: Int,
        countries: List<String>,
        yearRange: IntProgression = 1950..2000 step 5,
        ageRange: IntProgression = 0..80 step 5)
{
    val records = mutableListOf<DemographicStatisticRecord>()
    for (country in countries)
    {
        for (year in yearRange)
        {
            for (age in ageRange)
            {
                records.add(this.newDemographicRowRecord(
                        sourceId,
                        typeId,
                        country,
                        year,
                        age,
                        age + ageRange.step,
                        genderId = genderId,
                        variant = variantId,
                        value = random.nextDecimal(0, 100, numberOfDecimalPlaces = 2)
                ))
            }
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.addDemographicSourcesToTouchstone(touchstoneId: String, sources: List<Int>)
{
    val records = sources.map {
        this.dsl.newRecord(TOUCHSTONE_DEMOGRAPHIC_SOURCE).apply {
            this.touchstone = touchstoneId
            this.demographicSource = it
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.generateCountries(count: Int): List<String>
{
    val letters = "ABCDEFGHIJKLMNOPQSTUVWXYZ".toCharArray()
    val countries = (0..count).map {
        RandomStringUtils.random(3, 0, letters.size, true, false, letters, random).toUpperCase()
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
    val records = mutableListOf<CoverageRecord>()
    val countries = this.generateCountries(countryCount)
    for (country in countries)
    {
        for (year in yearRange)
        {
            for (age in ageRange)
            {
                records.add(this.newCoverageRowRecord(
                        coverageSetId,
                        country,
                        year,
                        ageFrom = BigDecimal(age),
                        ageTo = BigDecimal(age + ageRange.step),
                        ageRangeVerbatim = null,
                        target = null,
                        coverage = random.nextDecimal(0, 100, numberOfDecimalPlaces = 2)
                ))
            }
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.addCoverageRow(coverageSetId: Int, country: String, year: Int,
                               ageFrom: BigDecimal, ageTo: BigDecimal, ageRangeVerbatim: String?,
                               target: BigDecimal?, coverage: BigDecimal?)
{
    this.newCoverageRowRecord(
            coverageSetId,
            country,
            year,
            ageFrom,
            ageTo,
            ageRangeVerbatim,
            target,
            coverage
    ).store()
}

private fun JooqContext.newCoverageRowRecord(coverageSetId: Int, country: String, year: Int,
                                             ageFrom: BigDecimal, ageTo: BigDecimal, ageRangeVerbatim: String?,
                                             target: BigDecimal?, coverage: BigDecimal?)
        = this.dsl.newRecord(COVERAGE).apply {
    this.coverageSet = coverageSetId
    this.country = country
    this.year = year
    this.ageFrom = ageFrom
    this.ageTo = ageTo
    this.ageRangeVerbatim = ageRangeVerbatim
    this.target = target
    this.coverage = coverage
}

private fun JooqContext.newDemographicRowRecord(sourceId: Int, typeId: Int, country: String, year: Int,
                                                ageFrom: Int, ageTo: Int, variant: Int, genderId: Int,
                                                value: BigDecimal)
        = this.dsl.newRecord(DEMOGRAPHIC_STATISTIC).apply {
    this.demographicSource = sourceId
    this.country = country
    this.year = year
    this.ageFrom = ageFrom
    this.ageTo = ageTo
    this.demographicStatisticType = typeId
    this.demographicVariant = variant
    this.gender = genderId
    this.value = value
}

fun JooqContext.addUserForTesting(
        username: String,
        name: String = "Test User",
        email: String = "$username@example.com",
        password: String = "password"
)
{
    UserHelper.saveUser(this.dsl, username, name, email, password)
}

fun JooqContext.addUserWithRoles(username: String, vararg roles: ReifiedRole)
{
    this.addUserForTesting(username)
    for (role in roles)
    {
        this.ensureUserHasRole(username, role)
    }
}