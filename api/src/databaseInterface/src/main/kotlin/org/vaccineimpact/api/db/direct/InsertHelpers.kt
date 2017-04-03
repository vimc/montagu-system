package org.vaccineimpact.api.db.direct

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*

fun JooqContext.addGroup(id: String, description: String, current: String? = null)
{
    this.dsl.newRecord(MODELLING_GROUP).apply {
        this.id = id
        this.description = description
        this.current = current
    }.store()
}

fun JooqContext.addTouchstoneName(id: String)
{
    this.dsl.newRecord(TOUCHSTONE_NAME).apply {
        this.id = id
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
        status: String,
        yearRange: IntRange,
        addName: Boolean = false,
        addStatus: Boolean = false)
{
    if (addName)
    {
        addTouchstoneName(name)
    }
    if (addStatus)
    {
        addTouchstoneStatus(status)
    }
    this.dsl.newRecord(TOUCHSTONE).apply {
        this.id = "$name-$version"
        this.touchstoneName = name
        this.version = version
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

fun JooqContext.addScenario(touchstone: String, scenarioDescription: String): Int
{
    val record = this.dsl.newRecord(SCENARIO).apply {
        this.touchstone = touchstone
        this.scenarioDescription = scenarioDescription
    }
    record.store()
    return record.id
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
    val scenarioId = this.addScenario(touchstone, scenarioDescription)
    return this.addResponsibility(responsibilitySetId, scenarioId)
}