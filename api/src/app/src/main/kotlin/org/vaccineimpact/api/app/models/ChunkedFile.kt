package org.vaccineimpact.api.app.models

import java.io.File
import java.io.IOException
import java.util.concurrent.ConcurrentHashMap

data class ChunkedFile(val totalChunks: Int,
                       val totalSize: Long,
                       val chunkSize: Long,
                       val uniqueIdentifier: String,
                       val originalFileName: String
)
{

    val uploadedChunks = ConcurrentHashMap<Int, Boolean>()
    var filePath = "$UPLOAD_DIR/$uniqueIdentifier.temp"

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

    companion object
    {
        const val UPLOAD_DIR = "upload_dir"
    }
}