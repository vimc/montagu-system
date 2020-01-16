package org.vaccineimpact.api.tests.clients

import com.nhaarman.mockito_kotlin.mock
import okhttp3.OkHttpClient
import org.junit.Test
import org.vaccineimpact.api.app.clients.OkHttpOrderlyWebAPIClient
import org.vaccineimpact.api.test_helpers.MontaguTests

class TestOkHttpOrderlyWebAPIClient(private val client: OkHttpClient): OkHttpOrderlyWebAPIClient("test_montagu_token")
{
   protected override fun getHttpClient(): OkHttpClient
   {
       return client
   }
}

class OkHttpOrderlyWebAPIClientTests: MontaguTests()
{
    @Test
    fun `can add user`()
    {
        val mockClient = mock<OkHttpClient>{}
        val sut = TestOkHttpOrderlyWebAPIClient(mockClient)

        //sut.addUser("test@example.com", "test.user", "Test User")
        //Test get orderly web token
        //Test post to add user endpoint
    }
}