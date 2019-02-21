package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions.assertThat
import org.junit.After
import org.junit.Test
import org.vaccineimpact.api.app.ChunkedFileManager
import org.vaccineimpact.api.app.models.ChunkedFile
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.File

class ChunkedFileTests : MontaguTests()
{
    val uid = "uid"
    val tempFileName = "${ChunkedFileManager.UPLOAD_DIR}/$uid.temp"
    val finalFileName = "${ChunkedFileManager.UPLOAD_DIR}/$uid"

    @After
    fun `clean up files`(){
        File(tempFileName).delete()
        File(finalFileName).delete()
    }

    @Test
    fun `detects upload has finished when all chunks are present`()
    {
        val sut = ChunkedFile(totalChunks = 10, totalSize = 1000, chunkSize = 100,
                uniqueIdentifier = "uid", originalFileName = "file.csv")
        for (i in 1..10)
        {
            sut.uploadedChunks[i] = true
            assertThat(sut.uploadFinished()).isEqualTo(i == 10)
        }
    }

    @Test
    fun `deletes file on cleanup`() {
        val tempFile = File("${ChunkedFileManager.UPLOAD_DIR}/uid.temp")
        tempFile.createNewFile()

        val sut = ChunkedFile(totalChunks = 10, totalSize = 1000, chunkSize = 100, uniqueIdentifier = "uid",
                originalFileName = "file.csv")

        sut.cleanUp()
        assertThat(tempFile.exists()).isFalse()
    }

}