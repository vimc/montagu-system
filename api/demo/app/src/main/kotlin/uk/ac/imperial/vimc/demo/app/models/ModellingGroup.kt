package uk.ac.imperial.vimc.demo.app.models

data class ModellingGroup(override val id: Int,
                          val code: String,
                          val description: String): HasKey<Int>