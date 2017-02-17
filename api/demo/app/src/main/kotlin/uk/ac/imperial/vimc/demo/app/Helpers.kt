package uk.ac.imperial.vimc.demo.app

import java.io.FileNotFoundException
import java.net.URL

// The idea is that as this file grows, I'll group helpers and split them off into files/classes with more
// specific aims.

fun getResource(path: String): URL
{
    val url: URL? = DemoApp::class.java.classLoader.getResource(path)
    if (url != null)
    {
        return url
    } else
    {
        throw FileNotFoundException("Unable to load '$path' as a resource steam")
    }
}