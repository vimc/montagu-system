package org.vaccineimpact.api.models

interface HasKey<out TKey>
{
    val id: TKey
}