package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import khttp.responses.Response
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.createPermissions

fun validate(url: String) = FluentValidationConfig(url = url)

data class FluentValidationConfig(
        val url: String,
        val schemaName: String? = null,
        val prepareDatabase: ((JooqContext) -> Unit)? = null,
        val checkRequiredPermissions: Set<String>? = null,
        val ownedPermissions: Set<String>? = null
)
{
    infix fun against(schemaName: String) = this.copy(schemaName = schemaName)

    infix fun given(prepareDatabase: (JooqContext) -> Unit) = this.copy(prepareDatabase = prepareDatabase)

    infix fun requiringPermissions(requiredPermissions: () -> Set<String>)
            = this.copy(checkRequiredPermissions = setOf("can-login") + requiredPermissions())

    infix fun withPermissions(ownedPermissions: () -> Set<String>)
            = this.copy(ownedPermissions = setOf("can-login") + ownedPermissions())

    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
    {
        this.finalized().runWithObjectCheck(additionalChecks)
    }

    infix fun andCheckArray(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        this.finalized().runWithArrayCheck(additionalChecks)
    }

    private fun finalized() = FluentValidation(this)
}

class FluentValidation(config: FluentValidationConfig)
{
    val url = config.url
    val schemaName = config.schemaName ?: throw Exception("Missing 'against' clause in fluent validation builder")
    val prepareDatabase = config.prepareDatabase ?: throw Exception("Missing 'given' clause in fluent validation builder")
    val requiredPermissions: Set<String> = config.checkRequiredPermissions ?: setOf("can-login")
    val ownedPermissions: Set<String> = config.ownedPermissions ?: requiredPermissions

    val userHelper = TestUserHelper()
    val requestHelper = RequestHelper()

    fun runWithObjectCheck(additionalChecks: (JsonObject) -> Unit)
    {
        val response = run()
        additionalChecks(response.montaguData()!!)
    }

    fun runWithArrayCheck(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        val response = run()
        additionalChecks(response.montaguDataAsArray())
    }

    private fun run(): Response
    {
        val allPermissions = requiredPermissions + ownedPermissions
        JooqContext().use {
            prepareDatabase(it)
            userHelper.setupTestUser(it)
            it.createPermissions(allPermissions)
        }

        // Check that the auth token is required
        val validator = SchemaValidator()
        val badResponse = requestHelper.get(url)
        validator.validateError(badResponse.text)

        // Check the permissions
        if (requiredPermissions.any())
        {
            checkPermissions(url, validator)
        }

        // Check the actual response
        val token = userHelper.getTokenForTestUser(ownedPermissions)
        val response = requestHelper.get(url, token)
        validator.validate(schemaName, response.text)
        return response
    }

    private fun checkPermissions(url: String, validator: SchemaValidator)
    {
        for (permission in requiredPermissions)
        {
            checkPermission(url, permission, requiredPermissions, validator)
        }
    }

    private fun checkPermission(
            url: String,
            permission: String,
            allRequiringPermissions: Set<String>,
            validator: SchemaValidator)
    {
        println("Checking that permission '$permission' is required for $url")
        val limitedToken = userHelper.getTokenForTestUser(allRequiringPermissions - permission)
        val response = requestHelper.get(url, limitedToken)
        validator.validateError(response.text,
                assertionText = "Expected permission '$permission' to be required for $url")
    }
}