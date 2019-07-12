package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class TouchstoneModelExpectations
@ConstructorProperties("touchstoneVersion", "modellingGroup", "disease", "expectations")
constructor(val touchstoneVersion: String,
            val modellingGroup: String,
            val disease: String,
            val expectations: OutcomeExpectations)