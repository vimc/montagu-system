package uk.ac.imperial.vimc.demo.app.models

data class Country(override val id: String, val name: String) : HasKey<String>
{
    override fun toString(): String = this.id
}

