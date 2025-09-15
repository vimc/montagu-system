package uk.ac.imperial.vimc.demo.generateFromDatabase

import org.jooq.util.GenerationTool

fun main(args: Array<String>) {
    CodeGenerator().run()
}

class CodeGenerator {
    fun run() {
        val url = CodeGenerator::class.java.classLoader.getResource("config.xml")
        val config = url.openStream().use {
            GenerationTool.load(it)
        }
        GenerationTool().run(config)
    }
}
