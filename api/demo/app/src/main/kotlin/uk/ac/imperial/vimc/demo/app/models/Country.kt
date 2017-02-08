package uk.ac.imperial.vimc.demo.app.models

data class Country(val id: String, val name: String): HasKey<String> {
    override val key: String = id
    override fun toString(): String = id
}

