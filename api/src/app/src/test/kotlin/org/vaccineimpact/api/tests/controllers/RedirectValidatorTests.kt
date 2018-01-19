package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.test_helpers.MontaguTests

class RedirectValidatorTests : MontaguTests()
{
    @Test
    fun `support and prod redirect urls without https are not valid`()
    {
        val redirectValidator = MontaguRedirectValidator()

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
        val redirectValidator = MontaguRedirectValidator()

        redirectValidator.validateRedirectUrl("https://localhost")

        redirectValidator.validateRedirectUrl("https://montagu.vaccineimpact.org")

        redirectValidator.validateRedirectUrl("https://support.montagu.dide.ic.ac.uk")

    }

    @Test
    fun `localhost is valid`()
    {
        val redirectValidator = MontaguRedirectValidator()

        redirectValidator.validateRedirectUrl("http://localhost")
    }

    @Test
    fun `random redirect urls are not valid`()
    {
        val redirectValidator = MontaguRedirectValidator()

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("https://google.com")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("https://somethingelse.vaccineimpact.org")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("https://nonsense.montagu.dide.ic.ac.uk")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("https://montaguadide.ic.ac.uk")
        }

        Assertions.assertThatThrownBy {
            redirectValidator.validateRedirectUrl("https://montagudideicac.uk")
        }
    }

    @Test
    fun `can redirect to any path on allowed domains`()
    {
        val redirectValidator = MontaguRedirectValidator()

        redirectValidator.validateRedirectUrl("http://localhost/path")

        redirectValidator.validateRedirectUrl("https://montagu.vaccineimpact.org/page")

        redirectValidator.validateRedirectUrl("https://support.montagu.dide.ic.ac.uk/something")
    }
}