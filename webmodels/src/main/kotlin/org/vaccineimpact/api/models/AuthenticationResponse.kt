package org.vaccineimpact.api.models

interface AuthenticationResponse

data class SuccessfulAuthentication(val accessToken: Any): AuthenticationResponse
{
    val tokenType = "bearer"
    val expiresIn = 3600
}

data class FailedAuthentication(val error: String)