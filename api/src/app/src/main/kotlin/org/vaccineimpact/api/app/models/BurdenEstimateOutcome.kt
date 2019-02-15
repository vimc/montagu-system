package org.vaccineimpact.api.app.models

//An internal class used to hold a row containing a value for a single burden outcome for a burden estimate - these are retrieved
//from the database then combined so that the burden estimate rows in the csv we return each contain all burden outcomes.
//If there was such a thing as a burden estimate long row, it would look like this.

data class BurdenEstimateOutcome (
        val disease: String,
        val year: Short,
        val age: Short,
        val country: String,
        val countryName: String,
        val burden_outcom_code: String,
        val value: Float
)