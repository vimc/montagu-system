package uk.ac.imperial.vimc.demo.app.models

interface HasKey<out TKey> {
    val key: TKey
}