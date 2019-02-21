package org.vaccineimpact.api.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ChunkedFileCache
import org.vaccineimpact.api.app.models.ChunkedFile
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

class ChunkedFileCacheTests : MontaguTests()
{
    @Test
    fun `can put and read object from cache multiple times`()
    {
        val sut = ChunkedFileCache()
        val testInfo = ChunkedFile(10, 100, 1000, "uid", "file.csv")
        sut.put(testInfo)

        var result = sut["uid"]
        assertThat(result).isSameAs(testInfo)

        result = sut["uid"]
        assertThat(result).isSameAs(testInfo)
    }

    @Test
    fun `can remove object from cache`()
    {
        val sut = ChunkedFileCache()
        val testInfo = ChunkedFile(10, 100, 1000, "uid", "file.csv")
        sut.put(testInfo)

        var result = sut["uid"]
        assertThat(result).isSameAs(testInfo)

        sut.remove("uid")

        result = sut["uid"]
        assertThat(result).isNull()
    }

    @Test
    fun `removes old objects from cache on put operations`()
    {
        val flushInterval = TimeUnit.MILLISECONDS.toMillis(5)
        val sut = ChunkedFileCache(flushInterval)

        val oldUID = "old"
        val freshUID = "fresh"

        val oldInfo = ChunkedFile(10, 100, 1000, oldUID, "file.csv")
        sut.put(oldInfo)

        // first confirm that the object can be retrieved
        var result = sut[oldUID]
        assertThat(result).isNotNull()

        // now wait longer than the flush interval
        Thread.sleep(10)

        // make a fresh put request
        val newInfo = ChunkedFile(10, 100, 1000, freshUID, "somefile.csv")
        sut.put(newInfo)

        // the old object should have been flushed
        result = sut[oldUID]
        assertThat(result).isNull()

        // the new object should not have been flushed
        val newResult = sut[freshUID]
        assertThat(newResult).isNotNull()
    }


    @Test
    fun `removes old objects from cache on get operations`()
    {
        val oldUID = "old"
        val freshUID = "fresh"

        val flushInterval = TimeUnit.MILLISECONDS.toMillis(5)
        val sut = ChunkedFileCache(flushInterval)

        val oldInfo = ChunkedFile(10, 100, 1000, oldUID, "file.csv")
        sut.put(oldInfo)

        // first confirm that the object can be retrieved
        var result = sut[oldUID]
        assertThat(result).isNotNull()

        // now wait longer than the flush interval
        Thread.sleep(10)

        // make a fresh request for a different object
        val dummyGetRequest = sut[freshUID]
        result = sut[oldUID]
        assertThat(result).isNull()

    }

    @Test
    fun `can update and read from ChunkedFile items in concurrent threads`()
    {
        val sut = ChunkedFileCache()
        val testInfo = ChunkedFile(10, 100, 1000, "uid", "file.csv")
        sut.put(testInfo)

        var result = false
        val threads = mutableListOf<Thread>()
        File(testInfo.filePath).createNewFile()
        for (i in 1..10)
        {
            threads.add(
                    thread(start = true) {
                        sut["uid"]!!.uploadedChunks[i] = true
                        result = sut["uid"]!!.uploadFinished()
                    })
        }

        while (threads.any { it.isAlive })
        {
            // just wait for threads to finish
        }

        File(testInfo.filePath).delete()
        assertThat(result).isTrue()
    }

}