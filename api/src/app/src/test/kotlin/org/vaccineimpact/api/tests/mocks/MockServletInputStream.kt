package org.vaccineimpact.api.tests.mocks

import java.io.ByteArrayInputStream
import javax.servlet.ReadListener
import javax.servlet.ServletInputStream

class MockServletInputStream(private val source: ByteArrayInputStream) : ServletInputStream()
{
    override fun isReady(): Boolean
    {
        return true
    }

    override fun isFinished(): Boolean
    {
        return source.available() <= 0
    }

    override fun read(): Int
    {
        return source.read()
    }

    override fun setReadListener(readListener: ReadListener?)
    {
        //do nothing
    }
}