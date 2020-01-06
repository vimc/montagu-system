package org.vaccineimpact.api.databaseTests.tests.security

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.MontaguAuthorizationGenerator
import org.vaccineimpact.api.app.security.montaguPermissions
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.createRole
import org.vaccineimpact.api.security.ensureUserHasRole
import org.vaccineimpact.api.security.setRolePermissions
import org.vaccineimpact.api.test_helpers.DatabaseTest

class MontaguAuthorizationGeneratorTests : DatabaseTest()
{

    @Test
    fun `adds permissions to profile`()
    {
        withDatabase {
            UserHelper.saveUser(it.dsl, "test.user", "Test User", "test@test.com", "password")
            val roleId = it.createRole("role", scopePrefix = null, description = "Role")
            createPermissions(it, listOf("p1", "p2"))
            it.setRolePermissions(roleId, listOf("p1", "p2"))
            it.ensureUserHasRole("test.user", roleId, scopeId = "")
        }

        val expectedPermissions = PermissionSet(listOf(
                ReifiedPermission("p1", Scope.Global()),
                ReifiedPermission("p2", Scope.Global())
        ).toSet()).toString()

        val sut = MontaguAuthorizationGenerator<CommonProfile>(RepositoryFactory())
        val profile = CommonProfile().apply { setId("test.user") }
        sut.generate(mock(), profile)
        assertThat(profile.montaguPermissions.toString()).isEqualTo(expectedPermissions)
    }

    private fun createPermissions(db: JooqContext, permissions: List<String>)
    {
        val records = permissions.map {
            db.dsl.newRecord(Tables.PERMISSION).apply { name = it }
        }
        db.dsl.batchStore(records).execute()
    }
}
