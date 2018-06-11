package org.vaccineimpact.api.app.app_start

import org.docopt.Docopt
import org.slf4j.impl.SimpleLogger.DEFAULT_LOG_LEVEL_KEY
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import java.io.File

const val doc = """
Montagu API

Usage:
    app [run]
    app generate-token <permission>...
"""

fun main(args: Array<String>)
{
    val options = Docopt(doc).parse(args.toList())
    // See "Generating a root token" in README.md
    if (options["generate-token"] as Boolean)
    {
        // Bit of a hack to disable logging messing up our neat output
        System.setProperty(DEFAULT_LOG_LEVEL_KEY, "WARN")
        @Suppress("UNCHECKED_CAST")
        println(RootTokenGenerator().generate(options["<permission>"] as List<String>))
    }
    else
    {
        waitForGoSignal()
        val api = MontaguApi()
        api.run(RepositoryFactory())
    }
}

// This is so that we can copy files into the Docker container after it exists
// but before the API starts running.
private fun waitForGoSignal()
{
    val path = File("/etc/montagu/api/go_signal")
    println("Waiting for signal file at $path.")
    println("(In development environments, run `sudo touch $path`)")

    while (!path.exists())
    {
        Thread.sleep(2000)
    }
    println("Go signal detected. Running API")
}
