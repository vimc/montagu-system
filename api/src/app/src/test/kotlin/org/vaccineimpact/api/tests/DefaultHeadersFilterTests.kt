package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.verifyZeroInteractions
import org.junit.Test
import org.vaccineimpact.api.app.DefaultHeadersFilter
import org.vaccineimpact.api.test_helpers.MontaguTests
import spark.Request
import spark.Response
import spark.route.HttpMethod
import javax.servlet.http.HttpServletResponse

class DefaultHeadersFilterTests : MontaguTests()
{
    val contentType = "txt/ancient-manuscripts"

    @Test
    fun `filter sets content type`()
    {
        val filter = DefaultHeadersFilter(contentType, HttpMethod.get)
        val mockResponse = filter.handleMockRequest(HttpMethod.get)
        verify(mockResponse).contentType = contentType
    }

    @Test
    fun `filter sets headers`()
    {
        val filter = DefaultHeadersFilter(contentType, HttpMethod.get)
        val mockResponse = filter.handleMockRequest(HttpMethod.get)
        verify(mockResponse).addHeader("Content-Encoding", "gzip")
    }

    @Test
    fun `filter is not applied if method does not match`()
    {
        val filter = DefaultHeadersFilter(contentType, HttpMethod.get)
        val mockResponse = filter.handleMockRequest(HttpMethod.post)
        verifyZeroInteractions(mockResponse)
    }

    private fun DefaultHeadersFilter.handleMockRequest(requestMethod: HttpMethod): HttpServletResponse
    {
        val mockRequest = mock<Request> {
            on { requestMethod() } doReturn requestMethod.toString()
        }
        val mockServletResponse = mock<HttpServletResponse>()
        val mockResponse = mock<Response> {
            on { raw() } doReturn mockServletResponse
        }
        handle(mockRequest, mockResponse)
        return mockServletResponse
    }
}