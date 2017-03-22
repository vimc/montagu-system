package org.vaccineimpact.api.tests.helpers

import org.junit.rules.TestWatcher
import org.junit.runner.Description

class TeamCityIntegration : TestWatcher()
{
    override fun starting(description: Description)
    {
        println("##teamcity[testStarted name='${description.displayName}']")
    }

    override fun finished(description: Description)
    {
        println("##teamcity[testFinished name='${description.displayName}']")
    }

    override fun failed(e: Throwable, description: Description)
    {
        println("##teamcity[testFailed name='${description.displayName}' message=${e.message} details=$e]")
    }
}

