package org.vaccineimpact.api.app.models

import java.io.File
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap

data class ChunkedFile(val totalChunks: Int,
                       val chunkSize: Long,
                       val uniqueIdentifier: String,
                       var filePath: String
)
{
    constructor(totalChunks: Int, chunkSize: Long, uniqueIdentifier: String, file: File):
            this(totalChunks, chunkSize, uniqueIdentifier, "${file.absolutePath}.temp")

    val uploadedChunks = ConcurrentHashMap<Int, Boolean>()

    fun uploadFinished(): Boolean
    {
        for (i in 1..totalChunks)
        {
            if (!uploadedChunks.containsKey(i))
            {
                return false
            }
        }

        //Upload finished, change filename
        val file = File(filePath)
        val newPath = filePath.substring(0, filePath.length - ".temp".length)

        if (!file.renameTo(File(newPath))){
            throw IOException("Unable to rename file")
        }
        filePath = newPath
        return true
    }

    fun cleanUp() {
        File(filePath).delete()
    }
}