package org.vaccineimpact.api.models

data class ModelRunParameterSet(
        val responsibilitySet: Int,
        val description: String,
        val uploadInfo: UploadInfo,
        val modelVersion: Int,
        val parameters: List<String>,
        val modelRuns: List<ModelRun>
)

data class ModelRun(val runId: String, val parameterValues: Map<String, String>)