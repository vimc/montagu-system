package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Outcome
@ConstructorProperties("code", "name")
constructor(val code: String, val name: String)