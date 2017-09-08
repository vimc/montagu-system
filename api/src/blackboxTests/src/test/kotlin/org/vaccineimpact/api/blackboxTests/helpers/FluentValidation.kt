package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import khttp.responses.Response
import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.blackboxTests.schemas.JSONSchema
import org.vaccineimpact.api.blackboxTests.schemas.Schema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import spark.route.HttpMethod

fun validate(url: String, method: HttpMethod = HttpMethod.get)
        = FluentValidationConfig(url = url, method = method)

data class FluentValidationConfig(
        val url: String,
        val method: HttpMethod,
        private val requestSchema: Schema? = null,
        private val responseSchema: Schema? = null,
        val prepareDatabase: ((JooqContext) -> Unit)? = null,
        val checkRequiredPermissions: Set<ReifiedPermission>? = null,
        val ownedPermissions: Set<ReifiedPermission>? = null,
        val acceptsContentType: String? = null,
        val postData: String? = null
)
{
    infix fun against(schemaName: String) = this.copy(responseSchema = JSONSchema(schemaName))
    infix fun against(schema: Schema) = this.copy(responseSchema = schema)

    infix fun given(prepareDatabase: (JooqContext) -> Unit) = this.copy(prepareDatabase = prepareDatabase)

    infix fun requiringPermissions(requiredPermissions: () -> PermissionSet)
            = this.copy(checkRequiredPermissions = PermissionSet("*/can-login") + requiredPermissions())

    infix fun withPermissions(ownedPermissions: () -> PermissionSet)
            = this.copy(ownedPermissions = PermissionSet("*/can-login") + ownedPermissions())

    infix fun acceptingContentType(contentType: String) = this.copy(acceptsContentType = contentType)

    infix fun sendingJSON(postData: () -> JsonObject) = this.copy(postData = postData().toJsonString(prettyPrint = true))
    infix fun sending(postData: () -> String) = this.copy(postData = postData())

    infix fun withRequestSchema(schemaName: String) = this.copy(requestSchema = JSONSchema(schemaName))
    infix fun withRequestSchema(schema: () -> Schema) = this.copy(requestSchema = schema())

    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
    {
        this.finalized().runWithCheck({ data: JsonObject, _ -> additionalChecks(data) })
    }

    infix fun andCheckArray(additionalChecks: (JsonArray<Any>) -> Unit)
    {
        this.finalized().runWithCheck({ data: JsonArray<Any>, _ -> additionalChecks(data) })
    }

    infix fun andCheckString(additionalChecks: (String) -> Unit)
    {
        this.finalized().runWithCheck({ data: String, _ -> additionalChecks(data) })
    }

    infix fun andCheckObjectCreation(expectedLocation: String)
    {
        this.finalized().runWithCheck<String> { body, response ->
            val expectedPath = EndpointBuilder.buildPath(expectedLocation)
            assertThat(response.statusCode).`as`("Status code").isEqualTo(201)
            assertThat(response.headers["Location"]).`as`("Location header").endsWith(expectedPath)
            assertThat(body).`as`("Body").endsWith(expectedPath)
        }
    }

    fun run()
    {
        this.finalized().run()
    }

    private fun finalized() = FluentValidation(this)

    fun getRequestSchema() = requestSchema ?: when (method)
    {
        HttpMethod.get -> null
        HttpMethod.post -> throw Exception("Missing 'withRequestSchema' clause in fluent validation builder")
        else -> throw Exception("Unsupported request method '$method'")
    }

    fun getResponseSchema() = responseSchema ?: when (method)
    {
        HttpMethod.get -> throw Exception("Missing 'against' clause in fluent validation builder")
        HttpMethod.post -> JSONSchema("Create_Response")
        else -> throw Exception("Unsupported request method '$method'")
    }
}

class FluentValidation(config: FluentValidationConfig)
{
    val url = config.url
    val method = config.method
    val requestSchema = config.getRequestSchema()
    val responseSchema = config.getResponseSchema()
    val prepareDatabase = getDatabasePreparationScript(config)
    val requiredPermissions: Set<ReifiedPermission> = config.checkRequiredPermissions ?: PermissionSet("*/can-login")
    val ownedPermissions: Set<ReifiedPermission> = config.ownedPermissions ?: requiredPermissions
    val allPermissions = requiredPermissions + ownedPermissions
    val acceptContentType = config.acceptsContentType ?: ContentTypes.json
    val postData: String? = config.postData

    val userHelper = TestUserHelper()
    val requestHelper = RequestHelper()

    fun <T> runWithCheck(additionalChecks: (T, Response) -> Unit)
    {
        val response = run()
        additionalChecks(response.montaguData<T>()!!, response)
    }

    fun run(): Response
    {
        JooqContext().use {
            prepareDatabase(it)
            userHelper.setupTestUser(it)
        }

        // Check that the auth token is required
        println("Checking that auth token is required for $url")
        val badResponse = makeRequest(acceptContentType)
        responseSchema.validator.validateError(badResponse.text)

        // Check the permissions
        if (requiredPermissions.any())
        {
            checkPermissions(url)
        }

        // Check the actual response
        val token = userHelper.getTokenForTestUser(ownedPermissions)
        val response = makeRequest(acceptContentType, token)
        validate(response)
        return response
    }

    private fun validate(response: Response)
    {
        if (method == HttpMethod.post && requestSchema != null && postData != null)
        {
            requestSchema.validateRequest(postData)
        }
        responseSchema.validateResponse(response.text, response.headers["Content-Type"])
    }

    private fun makeRequest(contentType: String, token: TokenLiteral? = null): Response = when (method)
    {
        HttpMethod.get -> requestHelper.get(url, token = token, contentType = contentType)
        HttpMethod.post -> requestHelper.post(url, postData, token = token)
        else -> throw Exception("Requests of type $method are not supported")
    }

    private fun checkPermissions(url: String)
    {
        val checker = PermissionChecker(url, allPermissions, responseSchema.validator, acceptContentType,
                method = method,
                postData = postData)
        for (permission in requiredPermissions)
        {
            checker.checkPermissionIsRequired(permission)
        }
    }

    private fun getDatabasePreparationScript(config: FluentValidationConfig): (JooqContext) -> Unit
    {
        return config.prepareDatabase ?: when (config.method)
        {
            HttpMethod.post -> this::noDatabasePrep
            else -> throw Exception("Missing 'given' clause in fluent validation builder")
        }
    }

    @Suppress("UNUSED_PARAMETER")
    private fun noDatabasePrep(db: JooqContext)
    {
    }
}