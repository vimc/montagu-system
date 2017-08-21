package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions
import org.vaccineimpact.api.app.serialization.ModelBinder
import org.vaccineimpact.api.test_helpers.MontaguTests

abstract class ValidationTests : MontaguTests()
{
    val binder = ModelBinder()

    protected fun <T: Any> assertCausesTheseErrors(badModel: T, vararg codes: String)
    {
        val actual = binder.verify(badModel)
        val actualCodes = actual.joinToString { it.code }
        Assertions.assertThat(actual.size)
                .`as`("Expected these errors: ${codes.joinToString()} for this model: $badModel.\nActual: $actualCodes")
                .isEqualTo(codes.size)
        for (code in codes)
        {
            val matching = actual.filter { it.code == code }
            Assertions.assertThat(matching)
                    .`as`("Expected this error '$code' for this model: $badModel. These errors were present: $actualCodes")
                    .isNotEmpty
        }
    }
}