package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleColumns

data class ModelRunParameterSet(
        val responsibilitySet: Int,
        val description: String,
        val uploadInfo: UploadInfo,
        val modelVersion: Int,
        val modelRuns: List<ModelRun>
)

@FlexibleColumns
data class ModelRun(val runId: String, val parameterValues: Map<String, String>)