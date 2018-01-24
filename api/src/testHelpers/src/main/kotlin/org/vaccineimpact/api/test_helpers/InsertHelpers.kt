package org.vaccineimpact.api.db.direct

import org.vaccineimpact.api.db.*
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.tables.records.CoverageRecord
import org.vaccineimpact.api.db.tables.records.DemographicStatisticRecord
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.ensureUserHasRole
import java.math.BigDecimal
import java.sql.Timestamp
import java.time.Instant
import java.util.*

private val random = Random(0)

fun JooqContext.addGroup(id: String, description: String = id, current: String? = null)
{
    this.dsl.newRecord(MODELLING_GROUP).apply {
        this.id = id
        this.description = description
        this.replacedBy = current
        this.institution = "Some institution"
        this.pi = "Some PI"
    }.store()
}

fun JooqContext.addModel(
        id: String,
        groupId: String,
        diseaseId: String,
        description: String = id,
        citation: String = "Unknown citation",
        isCurrent: Boolean = true,
        versions: List<String> = emptyList()
): Int
{
    this.dsl.newRecord(MODEL).apply {
        this.id = id
        this.modellingGroup = groupId
        this.description = description
        this.citation = citation
        this.currentVersion = null
        this.isCurrent = isCurrent
        this.disease = diseaseId
    }.store()

    var versionId = 0
    for (version in versions)
    {
        versionId = addModelVersion(id, version, setCurrent = true)
    }

    return versionId
}

fun JooqContext.addModelVersion(
        modelId: String,
        version: String,
        note: String = "Some note",
        fingerprint: String = "Some fingerprint",
        setCurrent: Boolean = false
): Int
{
    val record = this.dsl.newRecord(MODEL_VERSION).apply {
        this.model = modelId
        this.version = version
        this.note = note
        this.fingerprint = fingerprint
    }
    record.store()

    if (setCurrent)
    {
        this.dsl.update(MODEL)
                .set(MODEL.CURRENT_VERSION, record.id)
                .where(MODEL.ID.eq(modelId))
                .execute()
    }

    return record.id
}

fun JooqContext.addTouchstoneName(id: String, description: String)
{
    this.dsl.newRecord(TOUCHSTONE_NAME).apply {
        this.id = id
        this.description = description
        this.comment = "Comment"
    }.store()
}

fun JooqContext.addTouchstone(
        name: String,
        version: Int,
        description: String = "Description",
        status: String = "open",
        addName: Boolean = false)
{
    if (addName)
    {
        addTouchstoneName(name, description)
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

fun JooqContext.addResponsibilitySet(
        modellingGroup: String,
        touchstone: String,
        status: String = "incomplete"
): Int
{
    val record = this.dsl.newRecord(RESPONSIBILITY_SET).apply {
        this.modellingGroup = modellingGroup
        this.touchstone = touchstone
        this.status = status
    }
    record.store()
    return record.id
}

fun JooqContext.addBurdenEstimateSet(
        responsibilityId: Int, modelVersionId: Int,
        username: String, status: String = "empty",
        setType: String = "central-single-run", setTypeDetails: String? = null,
        modelRunParameterSetId: Int? = null,
        timestamp: Instant = Instant.now(),
        setId: Int? = null
): Int
{
    val record = this.dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
        this.uploadedOn = Timestamp.from(timestamp)
        this.responsibility = responsibilityId
        this.modelVersion = modelVersionId
        this.uploadedBy = username
        this.setType = setType
        this.setTypeDetails = setTypeDetails
        this.runInfo = ""
        this.interpolated = false
        this.complete = false
        this.status = status
        this.modelRunParameterSet = modelRunParameterSetId
    }
    if (setId != null)
    {
        record.id = setId
    }
    record.store()
    return record.id
}

fun JooqContext.addBurdenEstimate(
        setId: Int,
        country: String,
        year: Int = 2000,
        age: Int = 20,
        outcome: String = "cohort_size",
        value: BigDecimal = 100.toDecimal(),
        modelRunId: Int? = null
): Int
{
    val outcomeId = this.dsl.select(BURDEN_OUTCOME.ID)
            .from(BURDEN_OUTCOME)
            .where(BURDEN_OUTCOME.CODE.eq(outcome))
            .fetchOne().value1()
    val record = this.dsl.newRecord(BURDEN_ESTIMATE).apply {
        this.burdenEstimateSet = setId
        this.country = country
        this.year = year
        this.age = age
        this.burdenOutcome = outcomeId
        this.value = value
        this.modelRun = modelRunId
    }
    record.store()
    return record.id
}

fun AnnexJooqContext.addStochasticBurdenEstimate(
        mainDb: JooqContext,
        setId: Int,
        country: String,
        year: Int = 2000,
        age: Int = 20,
        outcome: String = "cohort_size",
        value: BigDecimal = 100.toDecimal(),
        modelRunId: Int = 1
): Long
{
    val outcomeId = mainDb.dsl.select(BURDEN_OUTCOME.ID)
            .from(BURDEN_OUTCOME)
            .where(BURDEN_OUTCOME.CODE.eq(outcome))
            .fetchOne().value1()
    val record = this.dsl.newRecord(BURDEN_ESTIMATE_STOCHASTIC).apply {
        this.burdenEstimateSet = setId
        this.country = country
        this.year = year
        this.age = age
        this.burdenOutcome = outcomeId
        this.value = value
        this.modelRun = modelRunId
    }
    record.insert()
    return record.id
}

fun JooqContext.addModelRunParameterSet(
        responsibilitySetId: Int, modelVersionId: Int,
        username: String, description: String
): Int
{
    val uploadInfo = this.dsl.newRecord(UPLOAD_INFO).apply {
        this.uploadedBy = username
    }
    uploadInfo.store()

    val record = this.dsl.newRecord(MODEL_RUN_PARAMETER_SET).apply {
        this.responsibilitySet = responsibilitySetId
        this.modelVersion = modelVersionId
        this.uploadInfo = uploadInfo.id
        this.description = description
    }
    record.store()
    return record.id
}

fun JooqContext.addModelRun(runParameterSetId: Int, id: String): Int
{
    val record = this.dsl.newRecord(MODEL_RUN).apply {
        this.modelRunParameterSet = runParameterSetId
        this.runId = id
    }
    record.store()
    return record.internalId
}

fun JooqContext.addModelRunParameter(runParameterSetId: Int, key: String): Int
{
    val record = this.dsl.newRecord(MODEL_RUN_PARAMETER).apply {
        this.modelRunParameterSet = runParameterSetId
        this.key = key
    }
    record.store()
    return record.id
}

fun JooqContext.addModelRunParameterValue(modelRunId: Int, parameterId: Int, value: String): Int
{
    val record = this.dsl.newRecord(MODEL_RUN_PARAMETER_VALUE).apply {
        this.modelRun = modelRunId
        this.modelRunParameter = parameterId
        this.value = value
    }
    record.store()
    return record.id
}

fun JooqContext.addBurdenEstimateProblem(problem: String, burdenId: Int)
{
    val record = this.dsl.newRecord(BURDEN_ESTIMATE_SET_PROBLEM).apply {
        this.burdenEstimateSet = burdenId
        this.problem = problem
    }
    record.store()
}

fun JooqContext.updateCurrentEstimate(responsibilityId: Int, burdenId: Int)
{
    this.dsl.update(RESPONSIBILITY)
            .set(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET, burdenId)
            .where(RESPONSIBILITY.ID.eq(responsibilityId))
            .execute()
}

fun JooqContext.addResponsibility(responsibilitySetId: Int, scenarioId: Int,
                                  burdenId: Int? = null, open: Boolean = true): Int
{
    val record = this.dsl.newRecord(RESPONSIBILITY).apply {
        responsibilitySet = responsibilitySetId
        scenario = scenarioId
        currentBurdenEstimateSet = burdenId
        isOpen = open
    }
    record.store()
    return record.id
}

/** Creates both a responsibility and the scenario it depends on **/
fun JooqContext.addResponsibility(responsibilitySetId: Int, touchstone: String, scenarioDescription: String,
                                  open: Boolean = true): Int
{
    val scenarioId = this.addScenarioToTouchstone(touchstone, scenarioDescription)
    return this.addResponsibility(responsibilitySetId, scenarioId, open = open)
}

fun JooqContext.addCoverageSet(
        touchstoneId: String,
        name: String,
        vaccine: String,
        supportLevel: String,
        activityType: String,
        id: Int? = null,
        addVaccine: Boolean = false
): Int
{
    if (addVaccine)
    {
        this.addVaccine(vaccine)
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

fun JooqContext.addFocalCoverageSetToScenario(scenarioDescription: String, touchstoneId: String, coverageSetId: Int, order: Int)
{
    val scenarioId = this.dsl.select(SCENARIO.ID)
            .fromJoinPath(SCENARIO, SCENARIO_DESCRIPTION)
            .where(SCENARIO.TOUCHSTONE.eq(touchstoneId))
            .and(SCENARIO_DESCRIPTION.ID.eq(scenarioDescription))
            .fetchOneInto(Int::class.java)

    this.addCoverageSetToScenario(scenarioId, coverageSetId, order)

    this.dsl.update(SCENARIO)
            .set(SCENARIO.FOCAL_COVERAGE_SET, coverageSetId)
            .where(SCENARIO.ID.eq(scenarioId))
            .execute()
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

fun JooqContext.addTouchstoneCountries(touchstoneId: String, countryIds: List<String>, disease: String)
{
    val records = countryIds.map { country ->
        this.dsl.newRecord(TOUCHSTONE_COUNTRY).apply {
            this.touchstone = touchstoneId
            this.country = country
            this.disease = disease
        }
    }
    this.dsl.batchStore(records).execute()
}


fun JooqContext.generateDemographicSource(source: String): Int
{
    val record =
            this.dsl.newRecord(DEMOGRAPHIC_SOURCE).apply {
                this.code = source
                this.name = "$source descriptive name"
            }
    record.store()

    return record.id
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

fun JooqContext.fetchDemographicUnitIds(): List<Int>
{
    val sources = listOf("Number of people", "Number of deaths", "births per mother")
    return this.dsl.select(DEMOGRAPHIC_VALUE_UNIT.ID)
            .from(DEMOGRAPHIC_VALUE_UNIT)
            .where(DEMOGRAPHIC_VALUE_UNIT.NAME.`in`(sources))
            .fetchInto(Int::class.java)
}

fun JooqContext.fetchDemographicUnitId(name: String): Int
{
    return this.dsl.select(DEMOGRAPHIC_VALUE_UNIT.ID)
            .from(DEMOGRAPHIC_VALUE_UNIT)
            .where(DEMOGRAPHIC_VALUE_UNIT.NAME.eq(name))
            .fetchOne().value1()
}

fun JooqContext.fetchGenders(): List<Int>
{
    return this.dsl.select(GENDER.ID)
            .from(GENDER)
            .fetchInto(Int::class.java)
}

fun JooqContext.addDemographicStatisticType(type: String,
                                            variants: List<Int>,
                                            unit: Int,
                                            ageInterpretation: String = "age",
                                            genderIsApplicable: Boolean = false,
                                            yearStepSize: Int = 5,
                                            name: String = "$type descriptive name"): Int
{
    val record = this.dsl.newRecord(DEMOGRAPHIC_STATISTIC_TYPE).apply {
        this.code = type
        this.name = name
        this.defaultVariant = variants.first()
        this.demographicValueUnit = unit
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
                        value = random.nextDecimal(1000, 10000, numberOfDecimalPlaces = 2)
                ))

            }
        }
    }
    this.dsl.batchStore(records).execute()
}

fun JooqContext.addDemographicDatasetsToTouchstone(touchstoneId: String,
                                                   source: Int,
                                                   type: Int)
{
    val set = this.dsl.newRecord(DEMOGRAPHIC_DATASET).apply {
        this.demographicSource = source
        this.demographicStatisticType = type
        this.description = "some dataset"
    }

    set.store()

    val record =
            this.dsl.newRecord(TOUCHSTONE_DEMOGRAPHIC_DATASET).apply {
                this.touchstone = touchstoneId
                this.demographicDataset = set.id
            }

    record.store()
}

fun JooqContext.fetchCountries(count: Int): List<String>
{
    return dsl.select(COUNTRY.ID)
            .from(COUNTRY)
            .limit(count)
            .fetchInto(String::class.java)
}

fun JooqContext.generateCoverageData(
        coverageSetId: Int,
        countryCount: Int = 5,
        yearRange: IntProgression = 1960..2000 step 5,
        ageRange: IntProgression = 0..80 step 5,
        testYear: Int = 1955,
        target: BigDecimal = BigDecimal(100.12),
        coverage: BigDecimal = BigDecimal(200.13))
{
    val records = mutableListOf<CoverageRecord>()
    val countries = this.fetchCountries(countryCount)
    for (country in countries)
    {
        for (age in ageRange)
        {
            for (year in yearRange)
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

            records.add(this.newCoverageRowRecord(
                    coverageSetId,
                    country,
                    testYear,
                    ageFrom = BigDecimal(age),
                    ageTo = BigDecimal(age + ageRange.step),
                    ageRangeVerbatim = null,
                    target = target,
                    coverage = coverage
            ))
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