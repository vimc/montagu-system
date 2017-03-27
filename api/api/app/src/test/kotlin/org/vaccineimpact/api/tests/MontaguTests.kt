package org.vaccineimpact.api.tests

import org.junit.Rule
import org.vaccineimpact.api.tests.testhelpers.TeamCityIntegration

abstract class MontaguTests
{
    @get:Rule
    val teamCityIntegration = TeamCityIntegration()
}