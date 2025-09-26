package org.vaccineimpact.api.models

import java.beans.ConstructorProperties
import java.time.Instant

data class CoverageUploadMetadata
@ConstructorProperties("vaccine", "activityType", "uploadedBy", "uploadedOn")
constructor(val vaccine: String, val activityType: String, val uploadedBy: String, val uploadedOn: Instant)
