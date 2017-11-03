package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.controllers.RedirectValidator
import org.vaccineimpact.api.test_helpers.MontaguTests

class RedirectValidatorTests : MontaguTests()
{
    @Test
    fun `redirect urls without https are not valid`()
    {
        val redirectValidator = RedirectValidator()
        var valid = redirectValidator.redirectUrlIsValid("http://localhost")
        Assertions.assertThat(valid).isFalse()

        valid = redirectValidator.redirectUrlIsValid("http://montagu.vaccineimpact.org")
        Assertions.assertThat(valid).isFalse()

        valid = redirectValidator.redirectUrlIsValid("http://support.montagu.dide.ic.ac.uk")
        Assertions.assertThat(valid).isFalse()
    }

    @Test
    fun `redirect urls with https are valid`()
    {
        val redirectValidator = RedirectValidator()
        var valid = redirectValidator.redirectUrlIsValid("https://localhost")
        Assertions.assertThat(valid).isTrue()

        valid = redirectValidator.redirectUrlIsValid("https://montagu.vaccineimpact.org")
        Assertions.assertThat(valid).isTrue()

        valid = redirectValidator.redirectUrlIsValid("https://support.montagu.dide.ic.ac.uk")
        Assertions.assertThat(valid).isTrue()
    }

    @Test
    fun `random redirect urls are not valid`()
    {
        val redirectValidator = RedirectValidator()
        var valid = redirectValidator.redirectUrlIsValid("https://google.com")
        Assertions.assertThat(valid).isFalse()

        valid = redirectValidator.redirectUrlIsValid("https://somethingelse.vaccineimpact.org")
        Assertions.assertThat(valid).isFalse()

        valid = redirectValidator.redirectUrlIsValid("https://random.dide.ic.ac.uk")
        Assertions.assertThat(valid).isFalse()
    }

    @Test
    fun `can redirect to any path on allowed domains`()
    {
        val redirectValidator = RedirectValidator()
        var valid = redirectValidator.redirectUrlIsValid("https://localhost/somepath")
        Assertions.assertThat(valid).isTrue()

        valid = redirectValidator.redirectUrlIsValid("https://montagu.vaccineimpact.org/page")
        Assertions.assertThat(valid).isTrue()

        valid = redirectValidator.redirectUrlIsValid("https://support.montagu.dide.ic.ac.uk/something")
        Assertions.assertThat(valid).isTrue()
    }
}