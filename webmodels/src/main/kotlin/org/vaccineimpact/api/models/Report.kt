package org.vaccineimpact.api.models

import java.beans.ConstructorProperties
import java.time.Instant

data class Report
@ConstructorProperties("name", "displayname", "latestVersion", "published", "creationDate", "author",
        "requester")
constructor(val name: String,
            val displayName: String?,
            val latestVersion: String,
            val published: Boolean,
            val creationDate: Instant,
            val author: String?,
            val requester: String?)