package org.vaccineimpact.api.models

import java.time.Instant

data class UploadInfo(val uploadedBy: String, val uploadedOn: Instant)