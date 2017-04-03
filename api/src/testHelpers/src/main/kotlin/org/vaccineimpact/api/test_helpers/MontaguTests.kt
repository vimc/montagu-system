package org.vaccineimpact.api.test_helpers

import org.junit.Rule

abstract class MontaguTests
{
    @get:Rule
    val teamCityIntegration = TeamCityIntegration()
}