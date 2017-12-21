package org.vaccineimpact.api.app

import spark.Request

// Use this to make sure we have finished consuming the request
// before returning any response.
fun Request.consumeRemainder()
{
    val inputStream = this.raw()?.inputStream
    if (inputStream != null)
    {
        val buffer = ByteArray(8096)
        while (inputStream.read(buffer) > 0)
        {
            //keep going
        }
    }
}