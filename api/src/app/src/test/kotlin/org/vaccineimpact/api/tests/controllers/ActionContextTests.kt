package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.pac4j.core.context.Pac4jConstants
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.security.PERMISSIONS
import org.vaccineimpact.api.models.PermissionSet
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.test_helpers.MontaguTests

class ActionContextTests : MontaguTests()
{
    @Test
    fun `can get user profile`()
    {
        val profile = CommonProfile()
        val context = ActionContext(mockWebContext(profile))
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
        val context = ActionContext(mockWebContext(profile))
        assertThat(context.permissions).hasSameElementsAs(listOf(
                ReifiedPermission("can-login", Scope.Global()),
                ReifiedPermission("coverage.read", Scope.Specific("modelling-group", "IC-Garske"))
        ))
    }

    private fun mockWebContext(profile: CommonProfile): SparkWebContext
    {
        val webContext = mock<SparkWebContext> {
            on { getRequestAttribute(Pac4jConstants.USER_PROFILES) } doReturn profile
        }
        return webContext
    }
}