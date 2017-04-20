package org.vaccineimpact.api.test_helpers

class TeamCityIntegration : org.junit.rules.TestWatcher()
{
    override fun starting(description: org.junit.runner.Description)
    {
        println("##teamcity[testStarted name='${description.name()}']")
    }

    override fun finished(description: org.junit.runner.Description)
    {
        println("##teamcity[testFinished name='${description.name()}']")
    }

    override fun failed(e: Throwable, description: org.junit.runner.Description)
    {
        println("##teamcity[testFailed name='${description.name()}' message='${e.message}' details='$e']")
    }

    private fun org.junit.runner.Description.name() = "${this.className}.${this.methodName}"
}

