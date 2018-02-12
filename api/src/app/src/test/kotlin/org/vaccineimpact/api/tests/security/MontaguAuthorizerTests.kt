package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.security.MontaguAuthorizer
import org.vaccineimpact.api.test_helpers.MontaguTests

class MontaguAuthorizerTests : MontaguTests()
{
    @Test
    fun `is not authorized if url claim does not match request`()
    {
        val profile = CommonProfile().apply {
            addAttribute("url", "some/url")
        }
        val fakeContext = mock<SparkWebContext> {
            on(it.path) doReturn "/fake/url/"
        }

        val sut = MontaguAuthorizer(setOf())
        val result = sut.isAuthorized(fakeContext, listOf(profile))
        Assertions.assertThat(result).isFalse()

    }

    @Test
    fun `is authorized if claim is global *`()
    {
        val profile = CommonProfile().apply {
            addAttribute("url", "*")
        }
        val fakeContext = mock<SparkWebContext> {
            on(it.path) doReturn "/fake/url/"
        }

        val sut = MontaguAuthorizer(setOf())
        val result = sut.isAuthorized(fakeContext, listOf(profile))
        Assertions.assertThat(result).isTrue()
    }
}