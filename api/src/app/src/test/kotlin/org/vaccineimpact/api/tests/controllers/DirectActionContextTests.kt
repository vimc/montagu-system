package org.vaccineimpact.api.tests.controllers

import com.beust.klaxon.json
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.pac4j.core.context.Pac4jConstants
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.postData
import org.vaccineimpact.api.app.security.PERMISSIONS
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.test_helpers.MontaguTests
import spark.Request

class DirectActionContextTests : MontaguTests()
{
    @Test
    fun `can get user profile`()
    {
        val profile = CommonProfile()
        val context = DirectActionContext(mockWebContext(profile))
        assertThat(context.userProfile).isEqualTo(profile)
    }

    @Test
    fun `can get user permissions`()
    {
        val profile = CommonProfile().apply {
            addAttribute(PERMISSIONS, PermissionSet(
                    "*/can-login",
                    "modelling-group:IC-Garske/coverage.read"
            ))
        }
        val context = DirectActionContext(mockWebContext(profile))
        assertThat(context.permissions).hasSameElementsAs(listOf(
                ReifiedPermission("can-login", Scope.Global()),
                ReifiedPermission("coverage.read", Scope.Specific("modelling-group", "IC-Garske"))
        ))
    }

    @Test
    fun `requirePermission throws exception is user does not have permission`()
    {
        val profile = CommonProfile().apply {
            addAttribute(PERMISSIONS, PermissionSet(
                    "*/can-login"
            ))
        }
        val context = DirectActionContext(mockWebContext(profile))
        // Does not throw exception
        context.requirePermission(ReifiedPermission.parse("*/can-login"))
        assertThatThrownBy { context.requirePermission(ReifiedPermission.parse("*/can-dance")) }
                .hasMessageContaining("*/can-dance")
    }

    data class Model(val a: Int, val b: List<String>, val c: Model?)

    @Test
    fun `can deserialize post data`()
    {
        val body = json {
            obj(
                    "a" to 1,
                    "b" to array("x", "y"),
                    "c" to obj(
                            "a" to 100,
                            "b" to array("z")
                    )
            )
        }
        val mockRequest = mock<Request> {
            on { body() } doReturn body.toJsonString(prettyPrint = true)
        }
        val mockWebContext = mock<SparkWebContext> {
            on { sparkRequest } doReturn mockRequest
        }
        val context = DirectActionContext(mockWebContext)
        val model = context.postData<Model>()
        assertThat(model).isEqualTo(Model(1, listOf("x", "y"), Model(100, listOf("z"), null)))
    }

    private fun mockWebContext(profile: CommonProfile): SparkWebContext
    {
        val webContext = mock<SparkWebContext> {
            on { getRequestAttribute(Pac4jConstants.USER_PROFILES) } doReturn profile
        }
        return webContext
    }
}