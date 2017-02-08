package uk.ac.imperial.vimc.demo.app

import org.jooq.SQLDialect
import org.jooq.impl.DSL
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import java.sql.DriverManager

fun main(args: Array<String>) {
    val userName = "postgres"
    val password = ""
    val url = "jdbc:postgresql://localhost:8888/vimc"

    DriverManager.getConnection(url, userName, password).use { conn ->
        val create = DSL.using(conn, SQLDialect.POSTGRES)
        for (vaccine in create.fetch(Tables.VACCINE)) {
            println("(${vaccine.id}, ${vaccine.code}, ${vaccine.name})")
        }
    }
}