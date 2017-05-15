package org.vaccineimpact.api.blackboxTests.helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.createPermissions

class PermissionChecker(
        val url: String,
        val allRequiredPermissions: Set<String>)
{
    val helper = TestUserHelper()
    val validator = SchemaValidator()
    val requestHelper = RequestHelper()

    /**
     * Sets up the database and then checks both that you can access the URL
     * with the permission, and that you can't access it without
     */
    fun checkPermissionIsRequired(permissionUnderTest: String, given: (JooqContext) -> Unit)
    {
        JooqContext().use {
            given(it)
            TestUserHelper().setupTestUser(it)
            it.createPermissions(allRequiredPermissions)
        }

        checkPermissionIsRequired(permissionUnderTest, validator)

        val token = helper.getTokenForTestUser(allRequiredPermissions)
        val response = requestHelper.get(url, token)
        validator.validateSuccess(response.text)
    }

    /**
     * Makes no change to the database, and just checks that you can't access the URL
     * without the permission (doesn't check the opposite)
     */
    fun checkPermissionIsRequired(permission: String, validator: SchemaValidator)
    {
        println("Checking that permission '$permission' is required for $url")
        val limitedToken = helper.getTokenForTestUser(allRequiredPermissions - permission)
        val response = requestHelper.get(url, limitedToken)
        validator.validateError(response.text,
                expectedErrorCode = "forbidden",
                expectedErrorText = permission,
                assertionText = "Expected permission '$permission' to be required for $url")
    }
}