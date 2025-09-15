package org.vaccineimpact.api.app

import org.apache.commons.lang3.tuple.MutablePair
import org.vaccineimpact.api.app.models.ChunkedFile
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

interface Cache<T>
{
    operator fun get(uniqueIdentifier: String): T?
    fun put(item: T)
    fun remove(uniqueIdentifier: String)
}

class ChunkedFileCache(private val flushInterval: Long = TimeUnit.HOURS.toMillis(1)) : Cache<ChunkedFile>
{
    private val memoryCache = ConcurrentHashMap<String, MutablePair<ChunkedFile, Long>>()

    override operator fun get(uniqueIdentifier: String): ChunkedFile?
    {
        val item = memoryCache[uniqueIdentifier]
        if (item != null)
        {
            item.setRight(System.currentTimeMillis())
        }
        recycle()
        return item?.left
    }

    override fun put(item: ChunkedFile)
    {
        recycle()
        if (memoryCache[item.uniqueIdentifier] == null)
        {
            memoryCache[item.uniqueIdentifier] = MutablePair(item, System.currentTimeMillis())
        }
    }

    override fun remove(uniqueIdentifier: String)
    {
        memoryCache.remove(uniqueIdentifier)
    }

    private fun recycle()
    {
        memoryCache.filter {
            it.value.right < System.currentTimeMillis() - flushInterval
        }.map {
            remove(it.key)
        }
    }

    companion object
    {
        val instance = ChunkedFileCache()
    }
}