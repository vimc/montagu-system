package org.vaccineimpact.api.blackboxTests.validators

data class SplitText(val json: String, val csv: String)

class SplitValidator : Validator
{
    private val jsonValidator = JSONValidator()

    override fun validateError(response: String, expectedErrorCode: String?, expectedErrorText: String?, assertionText: String?)
    {
        val splitText = getSplitText(response)
        jsonValidator.validateError(splitText.json, expectedErrorCode, expectedErrorText, assertionText)
    }

    override fun validateSuccess(response: String, assertionText: String?)
    {
        val splitText = getSplitText(response)
        jsonValidator.validateSuccess(splitText.json, assertionText)
    }

    fun getSplitText(response: String): SplitText
    {
        val dividerPattern = Regex("^---+$", setOf(RegexOption.MULTILINE))
        val divider = dividerPattern.find(response)
        if (divider != null)
        {
            return SplitText(
                    json = response.substring(0, divider.range.start),
                    csv = response.substring(startIndex = divider.range.endInclusive + 1)
            )
        }
        else
        {
            return SplitText(json = response, csv = "")
        }
    }
}