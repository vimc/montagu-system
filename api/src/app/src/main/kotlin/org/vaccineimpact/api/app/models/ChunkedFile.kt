package org.vaccineimpact.api.app.models

import org.vaccineimpact.api.app.ChunkedFileManager.Companion.UPLOAD_DIR
import java.io.File
import java.util.concurrent.ConcurrentHashMap

data class ChunkedFile(val totalChunks: Int,
                       val totalSize: Long,
                       val chunkSize: Long,
                       val uniqueIdentifier: String,
                       val originalFileName: String
)
{
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

        return true
    }

    fun cleanUp() {
        File("$UPLOAD_DIR/$uniqueIdentifier").delete()
        File("$UPLOAD_DIR/$uniqueIdentifier.temp").delete()
    }

}