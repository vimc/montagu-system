package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Report
@ConstructorProperties("name", "displayname", "latestVersion", "published")
constructor(val name: String,
            val displayName: String?,
            val latestVersion: String,
            val published: Boolean)