package org.vaccineimpact.api.tests.app_start

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.nhaarman.mockito_kotlin.verifyZeroInteractions
import org.junit.Test
import org.vaccineimpact.api.app.app_start.AllowedOriginsFilter
import org.vaccineimpact.api.test_helpers.MontaguTests
import spark.Request
import spark.Response
import javax.servlet.http.HttpServletResponse

class AllowedOriginFilterTests : MontaguTests()
{

    @Test
    fun `allows UAT`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("https://support.montagu.dide.ic.ac.uk:10443/contrib")
        verify(mockResponse)
                .addHeader("Access-Control-Allow-Origin", "https://support.montagu.dide.ic.ac.uk:10443/contrib")
    }

    @Test
    fun `allows science`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("https://support.montagu.dide.ic.ac.uk:11443/admin")
        verify(mockResponse)
                .addHeader("Access-Control-Allow-Origin", "https://support.montagu.dide.ic.ac.uk:11443/admin")
    }

    @Test
    fun `allows production`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("https://montagu.vaccineimpact.org/reports")
        verify(mockResponse)
                .addHeader("Access-Control-Allow-Origin", "https://montagu.vaccineimpact.org/reports")
    }

    @Test
    fun `does not allow localhost`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("http://localhost")
        verifyZeroInteractions(mockResponse)
    }

    @Test
    fun `does not allow localhost on https`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("https://localhost")
        verifyZeroInteractions(mockResponse)
    }

    @Test
    fun `does not allow randoms`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest("https://google.com")
        verifyZeroInteractions(mockResponse)
    }

    @Test
    fun `does not allow no origin`()
    {
        val sut = AllowedOriginsFilter(false)
        val mockResponse = sut.handleMockRequest(null)
        verifyZeroInteractions(mockResponse)
    }

    @Test
    fun `allows localhost`()
    {
        val sut = AllowedOriginsFilter(true)
        val mockResponse = sut.handleMockRequest("http://localhost:5000")
        verify(mockResponse)
                .addHeader("Access-Control-Allow-Origin", "http://localhost:5000")
    }

    @Test
    fun `allows localhost on https`()
    {
        val sut = AllowedOriginsFilter(true)
        val mockResponse = sut.handleMockRequest("https://localhost")
        verify(mockResponse)
                .addHeader("Access-Control-Allow-Origin", "https://localhost")
    }

    private fun AllowedOriginsFilter.handleMockRequest(origin: String?): HttpServletResponse
    {
        val mockRequest = mock<Request> {
            on { headers("Origin") } doReturn origin
        }
        val mockServletResponse = mock<HttpServletResponse>()
        val mockResponse = mock<Response> {
            on { raw() } doReturn mockServletResponse
        }
        handle(mockRequest, mockResponse)
        return mockServletResponse
    }
}