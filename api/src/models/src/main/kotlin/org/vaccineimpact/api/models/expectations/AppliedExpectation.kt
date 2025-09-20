package org.vaccineimpact.api.models.expectations

interface AppliedExpectation
{
    val expectation: Expectations
    val applicableScenarios: List<String>
    val disease: String
}


