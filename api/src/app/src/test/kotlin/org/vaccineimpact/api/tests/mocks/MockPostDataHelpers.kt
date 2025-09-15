package org.vaccineimpact.api.tests.mocks

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.vaccineimpact.api.app.requests.PostDataHelper

fun <T : Any> mockCSVPostData(items: Sequence<T>): PostDataHelper
{
    return mock {
        on { csvData<T>(any(), any()) } doReturn items
    }
}

fun <T : Any> mockCSVPostData(items: List<T>) = mockCSVPostData(items.asSequence())