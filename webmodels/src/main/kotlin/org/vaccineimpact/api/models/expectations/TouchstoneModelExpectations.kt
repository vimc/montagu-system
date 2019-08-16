package org.vaccineimpact.api.models.expectations

import java.beans.ConstructorProperties

data class TouchstoneModelExpectations
@ConstructorProperties("touchstoneVersion", "modellingGroup", "disease", "expectations", "scenarios")
constructor(val touchstoneVersion: String,
            val modellingGroup: String,
            override val disease: String,
            override val expectation: OutcomeExpectations,
            override val applicableScenarios: List<String>): AppliedExpectation
