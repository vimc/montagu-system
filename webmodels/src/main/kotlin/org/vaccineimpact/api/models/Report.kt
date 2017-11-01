package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Report
@ConstructorProperties("name", "displayname", "latestVersion")
constructor(val name: String, val displayName: String?, val latestVersion: String)