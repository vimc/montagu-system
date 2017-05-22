package org.vaccineimpact.api.blackboxTests.schemas

class SplitSchema(json: String, csv: String) : Schema
{
    private val jsonSchema = JSONSchema(json)
    private val csvSchema = CSVSchema(csv)

    override fun validate(response: String)
    {
        val splitText = getSplitText(response)
        jsonSchema.validate(splitText.json)
        csvSchema.validate(splitText.csv)
    }

    private fun getSplitText(response: String): org.vaccineimpact.api.blackboxTests.schemas.SplitSchema.SplitText
    {
        val dividerPattern = Regex("^---+$", setOf(RegexOption.MULTILINE))
        val divider = dividerPattern.find(response)
        if (divider != null)
        {
            return org.vaccineimpact.api.blackboxTests.schemas.SplitSchema.SplitText(
                    json = response.substring(0..divider.range.start),
                    csv = response.substring(startIndex = divider.range.endInclusive)
            )
        }
        else
        {
            throw Exception("Unable to parse response as split JSON/CSV data. " +
                    "Could not find line consisting of three or more hyphens in $response")
        }
    }

    override fun validateError(jsonAsString: String, expectedErrorCode: String?, expectedErrorText: String?, assertionText: String?)
            = jsonSchema.validateError(jsonAsString, expectedErrorCode, expectedErrorText, assertionText)

    override fun validateSuccess(jsonAsString: String, assertionText: String?)
            = jsonSchema.validateSuccess(jsonAsString, assertionText)

    private data class SplitText(val json: String, val csv: String)
}