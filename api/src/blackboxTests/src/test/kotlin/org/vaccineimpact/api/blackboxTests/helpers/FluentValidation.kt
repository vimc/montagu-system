package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import khttp.responses.Response
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.blackboxTests.schemas.JSONSchema
import org.vaccineimpact.api.blackboxTests.schemas.Schema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.createPermissions
import org.vaccineimpact.api.models.PermissionSet
import org.vaccineimpact.api.models.ReifiedPermission

fun validate(url: String) = FluentValidationConfig(url = url)

data class FluentValidationConfig(
        val url: String,
        val schema: Schema? = null,
        val prepareDatabase: ((JooqContext) -> Unit)? = null,
        val checkRequiredPermissions: Set<ReifiedPermission>? = null,
        val ownedPermissions: Set<ReifiedPermission>? = null,
        val acceptsContentType: String? = null
)
{
    infix fun against(schemaName: String) = this.copy(schema = JSONSchema(schemaName))
    infix fun against(schema: Schema) = this.copy(schema = schema)

    infix fun given(prepareDatabase: (JooqContext) -> Unit) = this.copy(prepareDatabase = prepareDatabase)

    infix fun requiringPermissions(requiredPermissions: () -> PermissionSet)
            = this.copy(checkRequiredPermissions = PermissionSet("*/can-login") + requiredPermissions())

    infix fun withPermissions(ownedPermissions: () -> PermissionSet)
            = this.copy(ownedPermissions = PermissionSet("*/can-login") + ownedPermissions())

    infix fun acceptingContentType(contentType: String) = this.copy(acceptsContentType = contentType)

    infix fun andCheck(additionalChecks: (JsonObject) -> Unit)
    {
        this.finalized().runWithObjectCheck(additionalChecks)
    }
    infix fun andCheckArray(additionalChecks: (JsonArray<JsonObject>) -> Unit)
    {
        this.finalized().runWithArrayCheck(additionalChecks)
    }
    fun run()
    {
        this.finalized().run()
    }

    private fun finalized() = FluentValidation(this)
}

class FluentValidation(config: FluentValidationConfig)
{
    val url = config.url
    val schema = config.schema ?: throw Exception("Missing 'against' clause in fluent validation builder")
    val prepareDatabase = config.prepareDatabase ?: throw Exception("Missing 'given' clause in fluent validation builder")
    val requiredPermissions: Set<ReifiedPermission> = config.checkRequiredPermissions ?: PermissionSet("*/can-login")
    val ownedPermissions: Set<ReifiedPermission> = config.ownedPermissions ?: requiredPermissions
    val allPermissions = requiredPermissions + ownedPermissions
    val acceptContentType = config.acceptsContentType ?: ContentTypes.json

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

    fun run(): Response
    {
        JooqContext().use {
            prepareDatabase(it)
            userHelper.setupTestUser(it)
            userHelper.createPermissions(it, allPermissions)
        }

        // Check that the auth token is required
        val badResponse = requestHelper.get(url, contentType = acceptContentType)
        schema.validator.validateError(badResponse.text)

        // Check the permissions
        if (requiredPermissions.any())
        {
            checkPermissions(url)
        }

        // Check the actual response
        val token = userHelper.getTokenForTestUser(ownedPermissions)
        val response = requestHelper.get(url, token = token, contentType = acceptContentType)
        schema.validate(response.text)
        return response
    }

    private fun checkPermissions(url: String)
    {
        val checker = PermissionChecker(url, allPermissions, schema.validator, acceptContentType)
        for (permission in requiredPermissions)
        {
            checker.checkPermissionIsRequired(permission)
        }
    }
}