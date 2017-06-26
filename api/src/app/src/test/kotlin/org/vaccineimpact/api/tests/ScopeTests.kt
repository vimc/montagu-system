import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.Scope.*

class ScopeTests{

    @Test
    fun `global scope encompasses all scopes`()
    {
        val globalScope = Global()

        val specificScope = Specific("foo", "bar")

        assertThat(globalScope.encompasses(specificScope)).isTrue()
        assertThat(globalScope.encompasses(Global())).isTrue()
    }

    @Test
    fun `specific scope encompasses itself`()
    {
        val specificScope = Specific("foo", "bar")
        val specificScopeAgain = Specific("foo", "bar")

        assertThat(specificScope.encompasses(specificScopeAgain)).isTrue()
    }

    @Test
    fun `specific scope does not encompasses other scope`()
    {
        val specificScope = Specific("foo", "bar")
        val anotherSpecificScope = Specific("oof", "rab")

        assertThat(specificScope.encompasses(anotherSpecificScope)).isFalse()
        assertThat(specificScope.encompasses(Global())).isFalse()
    }

}