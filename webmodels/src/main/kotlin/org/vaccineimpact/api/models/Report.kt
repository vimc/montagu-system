package org.vaccineimpact.api.models

import java.beans.ConstructorProperties
import java.time.Instant

data class Report
@ConstructorProperties("name", "displayname", "latestVersion", "published", "date")
constructor(val name: String,
            val displayName: String?,
            val latestVersion: String,
            val published: Boolean,
            val lastGenerated: Instant)