
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.post
import khttp.structures.authorization.BasicAuthorization
import org.jooq.DSLContext
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList

sealed class TokenResponse
{
    class Token(val token: String): TokenResponse()
    class Error(val message: String): TokenResponse()
}

class TokenTestHelpers
{
    fun getToken(email: String, password: String): TokenResponse
    {
        val url = EndpointBuilder().build("/authenticate/")
        val auth = BasicAuthorization(email, password)
        val response = post(url,
                data = mapOf("grant_type" to "client_credentials"),
                auth = auth
        )
        val json = Parser().parse(StringBuilder(response.text)) as JsonObject
        if (json.containsKey("error"))
        {
            return TokenResponse.Error(json["error"] as String)
        }
        else
        {
            return TokenResponse.Token(json["access_token"] as String)
        }
    }

    fun setupPermissions(username: String, permissions: List<String>)
    {
        JooqContext().use {
            val dsl = it.dsl
            val testRoleId = getOrCreateTestRole(dsl)
            giveTestRoleToUser(dsl, testRoleId, username)
            setRolePermissions(dsl, testRoleId, permissions)
        }
    }

    private fun setRolePermissions(dsl: DSLContext, roleId: Int, permissions: List<String>)
    {
        dsl.deleteFrom(ROLE_PERMISSION)
                .where(ROLE_PERMISSION.ROLE.eq(roleId))
                .execute()
        val records = permissions.map { permission ->
            dsl.newRecord(ROLE_PERMISSION).apply {
                this.role = roleId
                this.permission = permission
            }
        }
        dsl.batchStore(records).execute()
    }

    private fun getOrCreateTestRole(dsl: DSLContext): Int
    {
        val testRoleId = getTestRoleId(dsl)
        if (testRoleId != null)
        {
            return testRoleId
        }
        else
        {
            return createTestRole(dsl)
        }
    }

    private fun getTestRoleId(dsl: DSLContext): Int?
    {
        return dsl.select(ROLE.ID)
                .from(ROLE)
                .where(ROLE.NAME.eq("test_role"))
                .fetchAny()?.value1()
    }

    private fun createTestRole(dsl: DSLContext): Int
    {
        val role = dsl.newRecord(ROLE).apply {
            name = "test_role"
            scopePrefix = null
            description = "Test role"
        }
        role.store()
        return role.id
    }

    private fun giveTestRoleToUser(dsl: DSLContext, testRoleId: Int, username: String)
    {
        val roleMapping = dsl.select(USER_ROLE.fieldsAsList())
                .from(USER_ROLE)
                .where(USER_ROLE.USERNAME.eq(username))
                .and(USER_ROLE.ROLE.eq(testRoleId))
                .fetchAny()
        if (roleMapping == null)
        {
            dsl.newRecord(USER_ROLE).apply {
                this.username = username
                this.role = testRoleId
                this.scopeId = ""
            }.store()
        }
    }
}