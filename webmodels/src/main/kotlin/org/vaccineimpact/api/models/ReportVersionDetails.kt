package org.vaccineimpact.api.models

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import java.beans.ConstructorProperties
import java.time.Instant

data class ReportVersionDetails
@ConstructorProperties("name", "displayname", "id", "published", "date", "author",
        "requester", "description", "comment", "script", "hashScript", "data", "artefacts")
constructor(val name: String,
            val displayName: String?,
            val id: String,
            val published: Boolean,
            val date: Instant,
            val author: String,
            val requester: String,
            val description: String,
            val comment: String,
            val script: String,
            val hashScript: String,
            val data: JsonObject,
            val artefacts: JsonArray)