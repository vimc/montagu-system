package org.vaccineimpact.api.tests

import org.assertj.core.api.Assertions.*
import org.junit.After
import org.junit.Test
import org.vaccineimpact.api.app.ChunkedFileManager
import org.vaccineimpact.api.app.models.ChunkedFile
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.File

class ChunkedFileUploadManagerTests : MontaguTests()
{
    val uid = "uid"
    val tempFileName = "${ChunkedFileManager.UPLOAD_DIR}/$uid.temp"
    val finalFileName = "${ChunkedFileManager.UPLOAD_DIR}/$uid"

    @After
    fun `clean up files`()
    {
        File(tempFileName).delete()
        File(finalFileName).delete()
    }

    @Test
    fun `renames file if upload is complete`()
    {
        val sut = ChunkedFileManager()
        val tempFile = File(tempFileName)
        val finalFile = File(finalFileName)
        tempFile.createNewFile()

        val testFile = ChunkedFile(totalChunks = 10, totalSize = 1000, chunkSize = 100, uniqueIdentifier = uid,
                originalFileName = "file.csv")

        assertThat(tempFile.exists()).isTrue()
        assertThat(finalFile.exists()).isFalse()

        for (i in 1..10)
        {
            testFile.uploadedChunks[i] = true
        }

        sut.markFileAsComplete(testFile)
        assertThat(tempFile.exists()).isFalse()
        assertThat(finalFile.exists()).isTrue()
    }

    @Test
    fun `can write chunks to file`()
    {
        val sut = ChunkedFileManager()

        val content = "TEST"
        val chunked = "TEST".chunked(1)

        val fakeFile = ChunkedFile(totalChunks = chunked.count(),
                totalSize = content.toByteArray().count().toLong(),
                chunkSize = 1,
                uniqueIdentifier = uid,
                originalFileName = "file.csv")

        for (i in 0 until chunked.count())
        {
            val stream = chunked[i].byteInputStream()
            val length = chunked[i].length
            sut.writeChunk(stream, length, fakeFile, i + 1)
        }

        assertThat(File(tempFileName).exists()).isTrue()
        val result = File(tempFileName).readText()
        assertThat(result).isEqualTo(content)

    }
}