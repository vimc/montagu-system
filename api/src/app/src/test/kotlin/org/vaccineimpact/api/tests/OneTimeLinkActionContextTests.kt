package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.OneTimeLinkActionContext
import org.vaccineimpact.api.test_helpers.MontaguTests

class OneTimeLinkActionContextTests : MontaguTests()
{
    @Test
    fun `can retrieve parameter from payload with or without colon`()
    {
        val payload = mapOf(":key" to "value")
        val context = OneTimeLinkActionContext(payload, mock())
        assertThat(context.params("key")).isEqualTo("value")
        assertThat(context.params(":key")).isEqualTo("value")
        assertThatThrownBy { context.params("bad key") }
    }
}