package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.models.CreateUser

class CreateUserTests : ValidationTests()
{
    private val model = CreateUser("user.name", "Full Name", "email@example.com")

    @Test
    fun `valid model verifies`()
    {
        assertThat(binder.verify(model)).isEmpty()
        assertThat(binder.verify(model.copy(username = "singleword"))).isEmpty()
        assertThat(binder.verify(model.copy(username = "lots.and.lots.of.words"))).isEmpty()
    }

    @Test
    fun `username must be valid`()
    {
        assertCausesTheseErrors(model.copy(username = ""), "invalid-field:username:blank")
        assertCausesTheseErrors(model.copy(username = "user name"), "invalid-field:username:bad-format")
        assertCausesTheseErrors(model.copy(username = "User.Name"), "invalid-field:username:bad-format")
        assertCausesTheseErrors(model.copy(username = "user-name"), "invalid-field:username:bad-format")
        assertCausesTheseErrors(model.copy(username = "user_name"), "invalid-field:username:bad-format")
        assertCausesTheseErrors(model.copy(username = "12345"), "invalid-field:username:bad-format")
        assertCausesTheseErrors(model.copy(username = "name&"), "invalid-field:username:bad-format")
    }

    @Test
    fun `email must be valid`()
    {
        assertCausesTheseErrors(model.copy(email = ""), "invalid-field:email:blank")
        assertCausesTheseErrors(model.copy(email = "user.name"), "invalid-field:email:bad-format")
        assertCausesTheseErrors(model.copy(email = "Full Name"), "invalid-field:email:bad-format")
        assertCausesTheseErrors(model.copy(email = "0800 123 4567"), "invalid-field:email:bad-format")
    }

    @Test
    fun `name is required`()
    {
        assertCausesTheseErrors(model.copy(name = ""), "invalid-field:name:blank")
    }
}