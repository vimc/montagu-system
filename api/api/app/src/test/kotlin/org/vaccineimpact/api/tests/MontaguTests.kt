package org.vaccineimpact.api.tests

import org.junit.Rule
import org.vaccineimpact.api.tests.helpers.TeamCityIntegration

abstract class MontaguTests
{
    @get:Rule
    val teamCityIntegration = TeamCityIntegration()
}