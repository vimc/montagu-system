package org.vaccineimpact.api.models

typealias YearLookup = HashMap<Short, Boolean>
typealias Year = Map.Entry<Short, Boolean>
typealias AgeLookup = HashMap<Short, YearLookup>
typealias YearsForAge = Map.Entry<Short, YearLookup>
typealias RowLookup = HashMap<String, AgeLookup>
typealias AgesForCountry = Map.Entry<String, AgeLookup>

fun Year.isMissing(): Boolean
{
    return !this.value
}

fun YearsForAge.hasMissingYear(): Boolean
{
    return this.value.any { it.isMissing() }
}

fun AgesForCountry.hasMissingAges(): Boolean
{
    return this.value.any { it.hasMissingYear() }
}

fun AgeLookup.firstAgeWithMissingRows(): Short {
    return this.filter { it.hasMissingYear() }.keys.first()
}

fun YearLookup.firstMissingYear(): Short {
    return this.filter { it.isMissing() }.keys.first()
}
