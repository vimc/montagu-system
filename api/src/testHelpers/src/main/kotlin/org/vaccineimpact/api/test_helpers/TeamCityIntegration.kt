package org.vaccineimpact.api.test_helpers

class TeamCityIntegration : org.junit.rules.TestWatcher()
{
    override fun starting(description: org.junit.runner.Description)
    {
        TeamCityHelper.startTest(description.name())
    }

    override fun finished(description: org.junit.runner.Description)
    {
        TeamCityHelper.finishTest(description.name())
    }

    override fun failed(e: Throwable, description: org.junit.runner.Description)
    {
        TeamCityHelper.failTest(e, description.name())
    }

    private fun org.junit.runner.Description.name() = "${this.className}.${this.methodName}"

    private fun escape(text: String?) = text
            ?.replace("|", "||")
            ?.replace("'", "|'")
            ?.replace("\r", "|r")
            ?.replace("\n", "|n")
            ?.replace("[", "|[")
            ?.replace("]", "|]")
}

