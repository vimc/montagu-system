package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class TouchstoneModelExpectations
@ConstructorProperties("touchstoneVersion", "modellingGroup", "disease", "expectations", "scenarios")
constructor(val touchstoneVersion: String,
            val modellingGroup: String,
            val disease: String,
            val expectations: OutcomeExpectations,
            val scenarios: List<String>)