package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.blackboxTests.validators.SplitValidator

class SplitSchema(json: String, csv: String) : Schema
{
    private val jsonSchema = JSONSchema(json)
    private val csvSchema = CSVSchema(csv)
    override val validator = SplitValidator()

    override fun validateResponse(response: String)
    {
        val splitText = validator.getSplitText(response)
        jsonSchema.validateResponse(splitText.json)
        csvSchema.validate(splitText.csv)
    }

    override fun validateRequest(request: String) = TODO("We don't (so far) need to post split JSON/CSV data")
}