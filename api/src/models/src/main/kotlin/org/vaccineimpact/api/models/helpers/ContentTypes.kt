package org.vaccineimpact.api.models.helpers

object ContentTypes
{
    val csv = "text/csv"
    val json = "application/json"

    val acceptableCSVTypes = listOf(csv, "application/csv", "text/plain")
}