package org.vaccineimpact.api.blackboxTests.schemas

import org.vaccineimpact.api.blackboxTests.validators.SplitValidator

class SplitSchema(json: String, csv: String) : Schema
{
    private val jsonSchema = JSONSchema(json)
    private val csvSchema = CSVSchema(csv)
    override val validator = SplitValidator()

    override fun validate(response: String)
    {
        val splitText = validator.getSplitText(response)
        jsonSchema.validate(splitText.json)
        csvSchema.validate(splitText.csv)
    }
}