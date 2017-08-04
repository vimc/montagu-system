package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.serialization.ModelBinder
import org.vaccineimpact.api.test_helpers.MontaguTests

class CreateUserTests : MontaguTests()
{
    val model = CreateUser("user.name", "Full Name", "email@example.com")
    val binder = ModelBinder()

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

    private fun assertCausesTheseErrors(badModel: CreateUser, vararg codes: String)
    {
        val actual = binder.verify(badModel)
        val actualCodes = actual.map { it.code }.joinToString()
        assertThat(actual.size)
                .`as`("Expected these errors: ${codes.joinToString()} for this model: $badModel.\nActual: $actualCodes")
                .isEqualTo(codes.size)
        for (code in codes)
        {
            val matching = actual.filter { it.code == code }
            assertThat(matching)
                    .`as`("Expected this error '$code' for this model: $badModel. These errors were present: $actualCodes")
                    .isNotEmpty
        }
    }
}