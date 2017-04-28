
import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.get
import org.vaccineimpact.api.db.JooqContext

fun validate(url: String) = FluentValidationValidateStep(url)

class FluentValidationValidateStep(val url: String)
{
    infix fun against(schemaName: String) = FluentValidationAgainstStep(url, schemaName)
}

class FluentValidationAgainstStep(val url: String, val schemaName: String)
{
    infix fun given(prepareDatabase: (JooqContext) -> Unit)
            = FluentValidationGivenStep(url, schemaName, prepareDatabase)
}

class FluentValidationGivenStep(val url: String, val schemaName: String, val prepareDatabase: (JooqContext) -> Unit)
{
    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
    {
        val validation = FluentValidation(url, schemaName, prepareDatabase)
        validation.runWithObjectCheck(additionalChecks)
    }
    infix fun andCheckArray(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        val validation = FluentValidation(url, schemaName, prepareDatabase)
        validation.runWithArrayCheck(additionalChecks)
    }
}

class FluentValidation(
        val url: String,
        val schemaName: String,
        val prepareDatabase: (JooqContext) -> Unit
)
{
    fun runWithObjectCheck(additionalChecks: (JsonObject) -> Unit)
    {
        val text = run()
        additionalChecks(getData(text) as JsonObject)
    }
    fun runWithArrayCheck(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        val text = run()
        additionalChecks(getData(text) as JsonArray<JsonObject>)
    }

    private fun run(): String
    {
        JooqContext().use {
            prepareDatabase(it)
        }

        val url = EndpointBuilder().build(url)
        val response = get(url)
        val validator = SchemaValidator()
        validator.validate(schemaName, response.text)
        return response.text
    }

    private fun getData(text: String) = parseJson(text)["data"]
    private fun parseJson(text: String) = Parser().parse(StringBuilder(text)) as JsonObject
}