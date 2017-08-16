package org.vaccineimpact.api.security

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.test_helpers.MontaguTests

class QuestionTests : MontaguTests()
{
    // This class allows us to feed in mock console input. The `mockInput` parameter is a list of things
    // that we are simulating the user entering one by one. Once one answer has been accepted, no more
    // later values in the mockInput list will be used.
    private class QuestionFromMockInput(fieldName: String, default: String?, mockInput: List<String?>)
        : Question(fieldName, default)
    {
        val mockInput = mockInput.toMutableList()

        override fun getLine(): String?
        {
            return mockInput.removeAt(0)
        }
    }


    @Test
    fun `question without default keeps asking until it gets non-blank input`()
    {
        val q = QuestionFromMockInput("name", null, listOf(null, "", "   ", "expected", "wrong"))
        assertThat(q.ask()).isEqualTo("expected")
    }

    @Test
    fun `question with default uses answer if provided`()
    {
        val q = QuestionFromMockInput("name", "Indiana Jones", listOf("expected"))
        assertThat(q.ask()).isEqualTo("expected")
    }

    @Test
    fun `question with default uses default if no answer provided`()
    {
        val q = QuestionFromMockInput("name", "expected", listOf(" "))
        assertThat(q.ask()).isEqualTo("expected")
    }
}