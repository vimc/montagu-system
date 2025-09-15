package uk.ac.imperial.vimc.demo.app.models

data class ModelIdentifier(val name: String, val version: String)

data class DatabaseModelIdentifier(val modelId: Int, val versionId: Int)