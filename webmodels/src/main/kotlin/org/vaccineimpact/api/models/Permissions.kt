package org.vaccineimpact.api.models

import java.sql.Timestamp

data class User(
        val username: String,
        val name: String,
        val email: String,
        val passwordHash: String,
        val salt: String,
        val lastLoggedIn: Timestamp?
)

data class Role(
        override val id: Int,
        val name: String,
        val scopePrefix: String,
        val description: String
): HasKey<Int>

data class Permission(
        val name: String
)