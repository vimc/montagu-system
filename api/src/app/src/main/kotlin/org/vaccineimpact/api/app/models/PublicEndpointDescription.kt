package org.vaccineimpact.api.app.models

import spark.route.HttpMethod

data class PublicEndpointDescription(
        val fullUrl: String,
        val method: HttpMethod,
        val contentType: String
)
