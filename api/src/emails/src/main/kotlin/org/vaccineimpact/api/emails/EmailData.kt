package org.vaccineimpact.api.emails

interface EmailData
{
    val subject: String
    fun text(): String
    fun html(): String
}