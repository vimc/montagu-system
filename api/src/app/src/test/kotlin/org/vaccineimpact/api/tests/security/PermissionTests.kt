package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedPermissionParseException
import org.vaccineimpact.api.test_helpers.MontaguTests

class PermissionTests : MontaguTests()
{
    @Test
    fun `can parse globally scoped permission`()
    {
        var permission = ReifiedPermission.parse("*/can-login")
        assertThat(permission).isEqualTo(ReifiedPermission("can-login", Scope.Global()))
    }

    @Test
    fun `can parse specifically scoped permission`()
    {
        var permission = ReifiedPermission.parse("prefix:id/name")
        assertThat(permission).isEqualTo(ReifiedPermission("name", Scope.Specific("prefix", "id")))
    }

    @Test
    fun `badly formatted string throws parse exception`()
    {
        assertThatThrownBy { ReifiedPermission.parse("") }
                .isInstanceOf(ReifiedPermissionParseException::class.java)
    }
}