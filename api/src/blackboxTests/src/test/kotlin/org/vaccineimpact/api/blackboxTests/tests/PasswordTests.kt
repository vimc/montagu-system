package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.emails.WriteToDiskEmailManager
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class PasswordTests : DatabaseTest()
{
    @Test
    fun `can set password`()
    {
        validate("/password/set/", HttpMethod.post) sendingJSON {
            json {
                obj("password" to "new_password")
            }
        } withRequestSchema "SetPassword" requiringPermissions {
            PermissionSet()
        } andCheckString {
            assertThat(it).isEqualTo("OK")

            checkPasswordHasChangedForTestUser("new_password")
        }
    }

    @Test
    fun `can request set password link`()
    {
        TestUserHelper.setupTestUser()
        WriteToDiskEmailManager.cleanOutputDirectory()
        val requestHelper = RequestHelper()

        // Request the link via (fake) email
        val url = "/password/request_link/?email=${TestUserHelper.email}"
        val response = requestHelper.post(url, null)
        val data = response.montaguData<String>()
        assertThat(data).isEqualTo("OK")

        // Use the token to change the password
        val token = getTokenFromFakeEmail()
        requestHelper.post("/onetime_link/$token/", json {
            obj("password" to "new_password")
        })

        checkPasswordHasChangedForTestUser("new_password")
    }

    companion object
    {
        fun getTokenFromFakeEmail(): String
        {
            val emailFile = WriteToDiskEmailManager.outputDirectory.listFiles().single()
                    ?: throw Exception("No emails were found in ${WriteToDiskEmailManager.outputDirectory}")
            val text = emailFile.readText()
            val match = Regex("""token=([^\n]+)\n""").find(text)
            return match?.groups?.get(1)?.value
                    ?: throw Exception("Unable to find token in $text")
        }

        fun checkPasswordHasChangedForTestUser(password: String)
        {
            assertThatThrownBy { TestUserHelper().getTokenForTestUser() }
            assertThat(TestUserHelper(password).getTokenForTestUser())
                    .isInstanceOf(TokenLiteral::class.java)
        }
    }
}