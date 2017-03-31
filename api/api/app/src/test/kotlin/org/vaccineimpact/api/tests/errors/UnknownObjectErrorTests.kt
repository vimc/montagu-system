package org.vaccineimpact.api.tests.errors

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.tests.MontaguTests

class UnknownObjectErrorTests : MontaguTests()
{
    @Test
    fun `can mangle single word type name`()
    {
        assertThat(UnknownObjectError.mangleTypeName("Toast"))
                .isEqualTo("toast")
    }

    @Test
    fun `can mangle multi-word type name`()
    {
        assertThat(UnknownObjectError.mangleTypeName("ToastFork"))
                .isEqualTo("toast-fork")
    }
}