package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.AllColumnsRequired
import org.vaccineimpact.api.models.helpers.FlexibleColumns
import java.beans.ConstructorProperties
import java.time.Instant

data class ModelRunParameterSet
@ConstructorProperties("id", "description", "model", "uploadedBy", "uploadedOn", "disease")
constructor(
        override val id: Int,
        val description: String,
        val model: String,
        val uploadedBy: String,
        val uploadedOn: Instant,
        val disease: String
): HasKey<Int>

@AllColumnsRequired
@FlexibleColumns
data class ModelRun(val runId: String, val parameterValues: Map<String, String>)