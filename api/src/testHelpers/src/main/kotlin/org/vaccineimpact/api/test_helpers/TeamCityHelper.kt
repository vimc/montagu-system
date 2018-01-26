package org.vaccineimpact.api.test_helpers

import java.io.PrintWriter
import java.io.StringWriter

object TeamCityHelper
{
    fun startSuite(name: String)
    {
        println("##teamcity[testSuiteStarted name='${escape(name)}']")
    }

    fun endSuite(name: String)
    {
        println("##teamcity[testSuiteFinished name='${escape(name)}']")
    }

    fun startTest(name: String)
    {
        println("##teamcity[testStarted name='${escape(name)}']")
    }

    fun finishTest(name: String)
    {
        println("##teamcity[testFinished name='${escape(name)}']")
    }

    fun failTest(e: Throwable, name: String)
    {
        val stackTrace = StringWriter().use {
            e.printStackTrace(PrintWriter(it))
            it.toString()
        }
        println("##teamcity[testFailed name='${escape(name)}' " +
                "message='${escape(e.message)}' " +
                "details='${escape(stackTrace)}']")
    }

    fun <T> asSuite(name: String, work: () -> T): T
    {
        startSuite(name)
        return try
        {
            work()
        }
        finally
        {
            endSuite(name)
        }
    }

    fun <T> asTest(name: String, work: () -> T): T
    {
        startTest(name)
        return try
        {
            work()
        }
        catch (e: Exception)
        {
            failTest(e, name)
            throw e
        }
        finally
        {
            finishTest(name)
        }
    }

    private fun escape(text: String?) = text
            ?.replace("|", "||")
            ?.replace("'", "|'")
            ?.replace("\r", "|r")
            ?.replace("\n", "|n")
            ?.replace("[", "|[")
            ?.replace("]", "|]")
}