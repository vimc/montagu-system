package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.models.SetPassword

class SetPasswordTests : ValidationTests()
{
    private val model = SetPassword("password")

    @Test
    fun `valid model verifies`()
    {
        assertThat(binder.verify(model)).isEmpty()
    }

    @Test
    fun `password is required`()
    {
        assertCausesTheseErrors(model.copy(password = ""), "invalid-field:password:blank")
        assertCausesTheseErrors(model.copy(password = " \n "), "invalid-field:password:blank")
    }

    @Test
    fun `password must be at least 8 characters long`()
    {
        assertCausesTheseErrors(model.copy(password = "passwor"), "invalid-field:password:too-short")
    }
}