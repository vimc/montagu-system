package org.vaccineimpact.api.models

data class Artefact(val format: ArtefactFormat, val description: String, val files: List<String>)
