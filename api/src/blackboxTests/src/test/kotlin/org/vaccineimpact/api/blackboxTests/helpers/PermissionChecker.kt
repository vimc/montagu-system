package org.vaccineimpact.api.blackboxTests.helpers

import com.beust.klaxon.JsonObject
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.validateSchema.JSONValidator
import org.vaccineimpact.api.validateSchema.Validator
import spark.route.HttpMethod

data class ExpectedProblem(val errorCode: String, val errorTextContains: String)

class PermissionChecker(
        val url: String,
        val allRequiredPermissions: Set<ReifiedPermission>,
        val validator: Validator = JSONValidator(),
        val acceptContentType: String = ContentTypes.json,
        val method: HttpMethod = HttpMethod.get,
        val postData: String? = null
)
{
    val helper = TestUserHelper()
    val requestHelper = RequestHelper()

    /**
     * Sets up the database and then checks both that you can access the URL
     * with the permission, and that you can't access it without
     */
    fun checkPermissionIsRequired(
            permissionUnderTest: String,
            given: (JooqContext) -> Unit,
            expectedProblem: ExpectedProblem? = null)
    {
        checkPermissionIsRequired(ReifiedPermission.parse(permissionUnderTest), given, expectedProblem)
    }
    private fun checkPermissionIsRequired(
            permissionUnderTest: ReifiedPermission,
            given: (JooqContext) -> Unit,
            expectedProblem: ExpectedProblem? = null)
    {
        JooqContext().use { db ->
            given(db)
            val userHelper = TestUserHelper()
            userHelper.setupTestUser(db)
        }

        checkPermissionIsRequired(permissionUnderTest, expectedProblem)

        val token = helper.getTokenForTestUser(allRequiredPermissions)
        val response = getResponse(token)
        validator.validateSuccess(response)
    }

    /**
     * Makes no change to the database, and just checks that you can't access the URL
     * without the permission (doesn't check the opposite)
     */
    fun checkPermissionIsRequired(
            permission: ReifiedPermission,
            expectedProblem: ExpectedProblem? = null
    )
    {
        @Suppress("NAME_SHADOWING")
        val expectedProblem = expectedProblem ?: ExpectedProblem("forbidden", permission.toString())
        val assertionText = "Expected permission '$permission' to be required for $url"
        val limitedPermissions = allRequiredPermissions - permission

        println("Checking that permission '$permission' is required for $url")
        checkThesePermissionsAreInsufficient(limitedPermissions, expectedProblem, assertionText)

        if (permission.scope is Scope.Specific)
        {
            val scope = permission.scope as Scope.Specific

            println("Checking that same permission with different scope will not satisfy the requirement")
            val badPermission = ReifiedPermission(permission.name, Scope.Specific(scope.scopePrefix, "bad-id"))
            checkThesePermissionsAreInsufficient(limitedPermissions + badPermission,
                    expectedProblem, assertionText)

            println("Checking that same permission with the global scope WILL satisfy the requirement")
            val betterPermission = ReifiedPermission(permission.name, Scope.Global())
            checkThesePermissionsAreSufficient(limitedPermissions + betterPermission,
                    "Expected to be able to substitute '$betterPermission' in place of '$permission' for $url")
        }
    }

    fun checkThesePermissionsAreInsufficient(
            permissions: Set<ReifiedPermission>,
            expectedProblem: ExpectedProblem,
            assertionText: String
    )
    {
        val limitedToken = helper.getTokenForTestUser(permissions)
        val response = getResponse(limitedToken)
        validator.validateError(response,
                expectedErrorCode = expectedProblem.errorCode,
                expectedErrorText = expectedProblem.errorTextContains,
                assertionText = assertionText)
    }

    fun checkThesePermissionsAreSufficient(permissions: Set<ReifiedPermission>,
                                           assertionText: String)
    {
        val token = helper.getTokenForTestUser(permissions)
        val response = getResponse(token)
        validator.validateSuccess(response, assertionText = assertionText)
    }

    private fun getResponse(token: TokenLiteral) = when (method)
    {
        HttpMethod.get -> requestHelper.get(url, token, acceptContentType).text
        HttpMethod.post -> requestHelper.post(url, postData, token).text
        else -> throw Exception("PermissionChecker does not support method $method")
    }
}