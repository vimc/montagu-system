package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.HTMLForm
import org.vaccineimpact.api.app.HTMLFormHelpers
import org.vaccineimpact.api.test_helpers.MontaguTests

class HTMLFormHelpersTests : MontaguTests()
{
    @Test
    fun `checkForm returns InvalidForm if content type does not match`()
    {
        val context = mock<ActionContext> {
            on { contentType() } doReturn "bad"
        }
        val result = HTMLFormHelpers().checkForm(context, emptyMap())
        assertThat(result).isInstanceOf(HTMLForm.InvalidForm::class.java)
    }

    @Test
    fun `checkForm returns InvalidForm if key is missing`()
    {
        val context = mock<ActionContext> {
            on { contentType() } doReturn "application/x-www-form-urlencoded"
            on { queryParams("key") } doReturn(null as String?)
        }
        val result = HTMLFormHelpers().checkForm(context, mapOf("key" to "value"))
        assertThat(result).isInstanceOf(HTMLForm.InvalidForm::class.java)
    }

    @Test
    fun `checkForm returns InvalidForm if key has wrong value`()
    {
        val context = mock<ActionContext> {
            on { contentType() } doReturn "application/x-www-form-urlencoded"
            on { queryParams("key") } doReturn "bad"
        }
        val result = HTMLFormHelpers().checkForm(context, mapOf("key" to "value"))
        assertThat(result).isInstanceOf(HTMLForm.InvalidForm::class.java)
    }

    @Test
    fun `checkForm returns ValidForm if all values match`()
    {
        val context = mock<ActionContext> {
            on { contentType() } doReturn "application/x-www-form-urlencoded"
            on { queryParams("key") } doReturn "value"
        }
        val result = HTMLFormHelpers().checkForm(context, mapOf("key" to "value"))
        assertThat(result).isEqualTo(HTMLForm.ValidForm())
    }
}