package org.vaccineimpact.api.models.expectations

typealias YearsForCountry = Map.Entry<String, YearLookup>
typealias CountryLookup = HashMap<String, YearLookup>
typealias CountriesForVaccine = Map.Entry<String, CountryLookup>
typealias CoverageRowLookup = MutableMap<String, CountryLookup>

fun YearLookup.missingYears(): Set<Short>
{
    return this.filter { it.isMissing() }.keys
}

fun YearsForCountry.hasMissingYear(): Boolean
{
    return this.value.any { it.isMissing() }
}

fun CountryLookup.missingRows(): Map<String, YearLookup>
{
    return this.filter { it.hasMissingYear() }
}

fun CountriesForVaccine.hasMissingRows(): Boolean
{
    return this.value.any { it.hasMissingYear() }
}

fun CoverageRowLookup.missingRows(): Map<String, CountryLookup>
{
    return this.filter { it.hasMissingRows() }
}
