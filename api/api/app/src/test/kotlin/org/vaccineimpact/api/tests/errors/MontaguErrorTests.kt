package org.vaccineimpact.api.tests.errors

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.MontaguError
import org.vaccineimpact.api.app.models.ErrorInfo
import org.vaccineimpact.api.tests.MontaguTests

class MontaguErrorTests : MontaguTests()
{
    @Test
    fun errorsAreFormattedCorrectly()
    {
        val errors = listOf(
                ErrorInfo("code1", "message1"),
                ErrorInfo("code2", "message2")
        )
        val actual = MontaguError.formatProblemsIntoMessage(errors)
        val expected = """the following problems occurred:
message1
message2"""
        assertThat(actual).isEqualTo(expected)
    }
}