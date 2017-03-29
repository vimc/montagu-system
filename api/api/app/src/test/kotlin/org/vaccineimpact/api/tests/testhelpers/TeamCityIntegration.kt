package org.vaccineimpact.api.tests.testhelpers

import org.junit.rules.TestWatcher
import org.junit.runner.Description

class TeamCityIntegration : TestWatcher()
{
    override fun starting(description: Description)
    {
        println("##teamcity[testStarted name='${description.name()}']")
    }

    override fun finished(description: Description)
    {
        println("##teamcity[testFinished name='${description.name()}']")
    }

    override fun failed(e: Throwable, description: Description)
    {
        println("##teamcity[testFailed name='${description.name()}' message=${e.message} details=$e]")
    }

    private fun Description.name() = "${this.className}.${this.methodName}"
}

