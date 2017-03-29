package org.vaccineimpact.api.app.models

interface HasKey<out TKey>
{
    val id: TKey
}