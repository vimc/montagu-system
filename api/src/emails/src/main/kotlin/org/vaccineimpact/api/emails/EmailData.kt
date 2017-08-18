package org.vaccineimpact.api.emails

interface EmailData
{
    val subject: String
    val text: String
    val html: String
}