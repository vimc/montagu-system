package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.permissions.Username

data class ModellingGroup(override val id: String,
                          val description: String) : HasKey<String>

data class ModellingGroupDetails(override val id: String,
                                 val description: String,
                                 val models: List<ResearchModel>,
                                 val users: List<Username>): HasKey<String>