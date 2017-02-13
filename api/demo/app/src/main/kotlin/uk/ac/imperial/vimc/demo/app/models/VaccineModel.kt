package uk.ac.imperial.vimc.demo.app.models

data class VaccineModel(override val id: Int,
                        val name: String,
                        val citation: String,
                        val description: String) : HasKey<Int>