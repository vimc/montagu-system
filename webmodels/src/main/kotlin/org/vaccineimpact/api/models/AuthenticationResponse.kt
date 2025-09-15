package org.vaccineimpact.api.models

import java.time.Duration

interface AuthenticationResponse

class SuccessfulAuthentication(val accessToken: Any, lifeSpan: Duration) : AuthenticationResponse
{
    val tokenType = "bearer"
    val expiresIn = lifeSpan.seconds

    override fun equals(other: Any?) = when (other)
    {
        is SuccessfulAuthentication ->
        {
            accessToken == other.accessToken
                    && tokenType == other.tokenType
                    && expiresIn == other.expiresIn
        }
        else -> false
    }
}

data class FailedAuthentication(val error: String) : AuthenticationResponse