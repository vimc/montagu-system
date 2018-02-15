package org.vaccineimpact.api.tests.requests

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.context.RequestData
import org.vaccineimpact.api.app.context.RequestDataSource
import org.vaccineimpact.api.app.errors.WrongDataFormatError
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.app.requests.csvData
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.StringReader

class PostDataHelpersTests : MontaguTests()
{
    @Test
    fun `throws WrongDataFormat if csvData is called with RequestBodySource and wrong content type`()
    {
        val file = RequestData(StringReader(""), contentType = "application/json")
        val source = mock<RequestDataSource> {
            on { getContent() } doReturn file
        }
        val sut = PostDataHelper()
        Assertions.assertThatThrownBy {
            sut.csvData<BurdenEstimate>(source)
        }.isInstanceOf(WrongDataFormatError::class.java)
    }
}