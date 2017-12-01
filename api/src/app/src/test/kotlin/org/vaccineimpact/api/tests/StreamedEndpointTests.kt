package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.controllers.endpoints.streamIfStreamable
import org.vaccineimpact.api.test_helpers.MontaguTests

class StreamedEndpointTests : MontaguTests()
{
    @Test
    fun `streamIfStreamable throws helpful exception if data is not StreamSerializable`()
    {
        assertThatThrownBy {
            streamIfStreamable(5, mock())
        }.hasMessage("Attempted to stream '5' (class java.lang.Integer), but it is not StreamSerializable")
    }
}