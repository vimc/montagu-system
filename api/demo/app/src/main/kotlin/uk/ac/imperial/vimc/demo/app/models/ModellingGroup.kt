package uk.ac.imperial.vimc.demo.app.models

data class ModellingGroup(override val id: String,
                          val description: String): HasKey<String>