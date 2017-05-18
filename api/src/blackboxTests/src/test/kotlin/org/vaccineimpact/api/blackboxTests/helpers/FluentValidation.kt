package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import khttp.responses.Response
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.createPermissions
import org.vaccineimpact.api.models.PermissionSet
import org.vaccineimpact.api.models.ReifiedPermission

fun validate(url: String) = FluentValidationConfig(url = url)

data class FluentValidationConfig(
        val url: String,
        val schemaName: String? = null,
        val prepareDatabase: ((JooqContext) -> Unit)? = null,
        val checkRequiredPermissions: Set<ReifiedPermission>? = null,
        val ownedPermissions: Set<ReifiedPermission>? = null
)
{
    infix fun against(schemaName: String) = this.copy(schemaName = schemaName)

    infix fun given(prepareDatabase: (JooqContext) -> Unit) = this.copy(prepareDatabase = prepareDatabase)

    infix fun requiringPermissions(requiredPermissions: () -> PermissionSet)
            = this.copy(checkRequiredPermissions = PermissionSet("*/can-login") + requiredPermissions())

    infix fun withPermissions(ownedPermissions: () -> PermissionSet)
            = this.copy(ownedPermissions = PermissionSet("*/can-login") + ownedPermissions())

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
    val requiredPermissions: Set<ReifiedPermission> = config.checkRequiredPermissions ?: PermissionSet("*/can-login")
    val ownedPermissions: Set<ReifiedPermission> = config.ownedPermissions ?: requiredPermissions
    val allPermissions = requiredPermissions + ownedPermissions

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
        JooqContext().use {
            prepareDatabase(it)
            userHelper.setupTestUser(it)
            it.createPermissions(allPermissions.map { it.name })
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
        val checker = PermissionChecker(url, allPermissions)
        for (permission in requiredPermissions)
        {
            checker.checkPermissionIsRequired(permission, validator)
        }
    }
}