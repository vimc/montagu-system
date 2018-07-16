package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Country
@ConstructorProperties("id", "name")
constructor(val id: String, val name: String)
