package org.vaccineimpact.api.security

enum class TokenType
{
    BEARER,
    LEGACY_ONETIME,
    ONETIME,
    MODEL_REVIEW,
    API_RESPONSE,
    UPLOAD
}