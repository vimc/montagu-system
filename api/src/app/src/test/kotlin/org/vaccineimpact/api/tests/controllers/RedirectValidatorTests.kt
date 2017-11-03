package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.test_helpers.MontaguTests

class RedirectValidatorTests : MontaguTests()
{
    @Test
    fun `redirect urls without https are not valid`()
    {
        val redirectValidator = RedirectValidator()
        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://localhost")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://montagu.vaccineimpact.org")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://support.montagu.dide.ic.ac.uk")
        }
    }

    @Test
    fun `redirect urls with https are valid`()
    {
        val redirectValidator = RedirectValidator()

        redirectValidator.validateRedirectUrl("https://localhost")

        redirectValidator.validateRedirectUrl("https://montagu.vaccineimpact.org")

        redirectValidator.validateRedirectUrl("https://support.montagu.dide.ic.ac.uk")

    }

    @Test
    fun `random redirect urls are not valid`()
    {
        val redirectValidator = RedirectValidator()

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://localhost")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://somethingelse.vaccineimpact.org")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("http://nonsense.montagu.dide.ic.ac.uk")
        }
    }

    @Test
    fun `can redirect to any path on allowed domains`()
    {
        val redirectValidator = RedirectValidator()

        redirectValidator.validateRedirectUrl("https://localhost/path")

        redirectValidator.validateRedirectUrl("https://montagu.vaccineimpact.org/page")

        redirectValidator.validateRedirectUrl("https://support.montagu.dide.ic.ac.uk/something")
    }
}