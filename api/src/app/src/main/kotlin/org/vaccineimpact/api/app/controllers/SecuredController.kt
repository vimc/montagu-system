package org.vaccineimpact.api.app.controllers

import org.pac4j.core.config.Config
import org.pac4j.sparkjava.SecurityFilter
import org.vaccineimpact.api.app.security.JWTHeaderClient
import spark.Spark.before

abstract class SecuredController : AbstractController()
{
    fun setupSecurity(urlBase: String, tokenVerifier: Config)
    {
        before("$urlBase/$urlComponent/*", SecurityFilter(tokenVerifier, JWTHeaderClient::class.java.simpleName))
    }
}