package org.vaccineimpact.api.security

enum class CookieName(val cookieName: String)
{
    Main("montagu_jwt_token"),
    // This must have this name, as that's what Caddy expects
    ModelReview("jwt_token")
}
