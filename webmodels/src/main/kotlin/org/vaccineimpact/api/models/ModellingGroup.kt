package org.vaccineimpact.api.models

data class ModellingGroup(override val id: String,
                          val description: String) : HasKey<String>

data class ModellingGroupDetails(override val id: String,
                                 val description: String,
                                 val models: List<ResearchModel>,
                                 val admins: List<Username>): HasKey<String>