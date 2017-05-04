import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.get
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.security.UserHelper

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
    infix fun requiringPermissions(requiredPermissions: () -> List<String>)
            = FluentValidationRequiringPermissionsStep(url, schemaName, prepareDatabase, requiredPermissions())

    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
            = requiringPermissions({ emptyList() }).andCheck(additionalChecks)

    infix fun andCheckArray(additionalChecks: (JsonArray<JsonObject>) -> Unit)
            = requiringPermissions({ emptyList() }).andCheckArray(additionalChecks)
}

class FluentValidationRequiringPermissionsStep(
        val url: String,
        val schemaName: String,
        val prepareDatabase: (JooqContext) -> Unit,
        val requiredPermissions: List<String>)
{
    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
    {
        val validation = FluentValidation(url, schemaName, prepareDatabase, requiredPermissions)
        validation.runWithObjectCheck(additionalChecks)
    }

    infix fun andCheckArray(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        val validation = FluentValidation(url, schemaName, prepareDatabase, requiredPermissions)
        validation.runWithArrayCheck(additionalChecks)
    }
}

class FluentValidation(
        val url: String,
        val schemaName: String,
        val prepareDatabase: (JooqContext) -> Unit,
        val requiredPermissions: List<String>
)
{
    val testUsername = "test.user"
    val testUserEmail = "user@test.com"
    val testUserPassword = "test"
    val tokenHelper = TokenTestHelpers()

    fun runWithObjectCheck(additionalChecks: (JsonObject) -> Unit)
    {
        val text = run()
        additionalChecks(getData(text) as JsonObject)
    }

    fun runWithArrayCheck(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        val text = run()
        @Suppress("UNCHECKED_CAST")
        additionalChecks(getData(text) as JsonArray<JsonObject>)
    }

    private fun run(): String
    {
        val allRequiredPermissions = listOf("can-login") + requiredPermissions
        JooqContext().use {
            prepareDatabase(it)
            UserHelper.saveUser(it.dsl, testUsername, "Test User", testUserEmail, testUserPassword)
            tokenHelper.createPermissions(it.dsl, allRequiredPermissions)
        }
        val url = EndpointBuilder().build(url)

        // Check that the auth token is required
        val validator = SchemaValidator()
        val badResponse = get(url)
        validator.validateError(badResponse.text)

        // Check permissions
        for (permission in allRequiredPermissions)
        {
            checkPermission(url, permission, allRequiredPermissions, validator)
        }

        // Check the actual response
        val token = getToken(allRequiredPermissions)
        val response = doRequest(url, token)
        validator.validate(schemaName, response.text)
        return response.text
    }

    private fun getToken(permissions: List<String>): String
    {
        tokenHelper.setupPermissions(testUsername, permissions)
        val token = tokenHelper.getToken(testUserEmail, testUserPassword)
        return when (token)
        {
            is TokenResponse.Token -> token.token
            is TokenResponse.Error -> throw Exception("Unable to obtain auth token: '${token.message}'")
        }
    }

    private fun checkPermission(
            url: String, permission: String,
            allRequiringPermissions: List<String>,
            validator: SchemaValidator)
    {
        println("Checking that permission '$permission' is required for $url")
        val limitedToken = getToken(allRequiringPermissions - permission)
        val response = doRequest(url, limitedToken)
        validator.validateError(response.text, errorText = "Expected permission '$permission' to be required for $url")
    }

    private fun doRequest(url: String, token: String) = get(url,
        headers = mapOf("Authorization" to "Bearer $token")
    )
    private fun getData(text: String) = parseJson(text)["data"]
    private fun parseJson(text: String) = Parser().parse(StringBuilder(text)) as JsonObject
}