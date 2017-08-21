package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.TokenLiteral
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class PasswordTests : DatabaseTest()
{
    @Test
    fun `can set password`()
    {
        validate("/password/set/", HttpMethod.post) sending {
            json {
                obj("password" to "new_password")
            }
        } withRequestSchema "SetPassword" requiringPermissions {
            PermissionSet()
        } andCheckString {
            assertThat(it).isEqualTo("OK")

            assertThatThrownBy { TestUserHelper().getTokenForTestUser() }
            assertThat(TestUserHelper("new_password").getTokenForTestUser())
                    .isInstanceOf(TokenLiteral::class.java)
        }
    }

    @Test
    fun `can request set password link`()
    {
        val url = "/password/request_link/?email=martin.eden@imperial.ac.uk"
        validate(url, HttpMethod.post).withoutToken() given {
            UserHelper.saveUser(it.dsl, "martin.eden", "Martin Eden", "martin.eden@imperial.ac.uk", "password")
        } andCheckString {
            assertThat(it).isEqualTo("OK")
        }
    }
}