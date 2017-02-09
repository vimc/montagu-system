package uk.ac.imperial.vimc.demo.app.models

data class Scenario(override val id: String,
                    val description: String,
                    val vaccinationLevel: String,
                    val disease: String,
                    val vaccine: String,
                    val scenarioType: String): HasKey<String>