package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.models.ChunkedFile
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

interface Cache<T> {
    operator fun get(uniqueIdentifier: String): T?
    fun put(item: T)
    fun remove(uniqueIdentifier: String)
}

class ChunkedFileCache(val flushInterval: Long = TimeUnit.HOURS.toMillis(1)): Cache<ChunkedFile>
{
    private val memoryCache = ConcurrentHashMap<String, ChunkedFile>()
    private val lastAccessedMap = ConcurrentHashMap<String, Long>()

    override operator fun get(uniqueIdentifier: String): ChunkedFile?
    {
        lastAccessedMap[uniqueIdentifier] = System.currentTimeMillis()
        recycle()
        return memoryCache[uniqueIdentifier]
    }

    override fun put(item: ChunkedFile)
    {
        lastAccessedMap[item.uniqueIdentifier] = System.currentTimeMillis()
        recycle()
        memoryCache[item.uniqueIdentifier] = item
    }

    override fun remove(uniqueIdentifier: String)
    {
        memoryCache[uniqueIdentifier]?.cleanUp()
        lastAccessedMap.remove(uniqueIdentifier)
        memoryCache.remove(uniqueIdentifier)
    }

    private fun recycle() {
        lastAccessedMap.filter {
            it.value < System.currentTimeMillis() - flushInterval
        }.map {
            remove(it.key)
        }
    }

    companion object
    {
        val instance = ChunkedFileCache()
    }
}