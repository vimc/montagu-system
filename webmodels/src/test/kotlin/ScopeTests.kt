import org.junit.Test
import org.vaccineimpact.api.models.Scope.*

class ScopeTests{

    @Test
    fun `global scope encompasses all scopes`()
    {
        val globalScope = Global()

        val specificScope = Specific("foo", "bar")

        assert(globalScope.encompasses(specificScope))
        assert(globalScope.encompasses(Global()))
    }

    @Test
    fun `specific scope encompasses itself`()
    {
        val specificScope = Specific("foo", "bar")
        val specificScopeAgain = Specific("foo", "bar")

        assert(specificScope.encompasses(specificScopeAgain))
    }

    @Test
    fun `specific scope does not encompasses other scope`()
    {
        val specificScope = Specific("foo", "bar")
        val anotherSpecificScope = Specific("oof", "rab")

        assert(!specificScope.encompasses(anotherSpecificScope))
        assert(!specificScope.encompasses(Global()))
    }

}