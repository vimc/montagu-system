package org.vaccineimpact.api.app

import spark.Request

// Use this to make sure we have finished consuming the request
// before returning any response.
fun Request.consumeRemainder()
{
    val inputStream = this.raw()?.inputStream

    // This null check is just here to make unit testing easier - this way
    // we don't have to mock out .raw in so many tests
    if (inputStream != null)
    {
        val buffer = ByteArray(8096)
        while (!inputStream.isFinished)
        {
            inputStream.read(buffer)
            //keep going
        }
    }
}