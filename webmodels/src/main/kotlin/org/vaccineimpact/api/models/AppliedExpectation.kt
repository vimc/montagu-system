package org.vaccineimpact.api.models

interface AppliedExpectation
{
    val expectation: Expectations
    val applicableScenarios: List<String>
    val disease: String
}


