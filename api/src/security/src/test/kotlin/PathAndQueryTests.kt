import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.pac4j.core.context.WebContext
import org.vaccineimpact.api.security.PathAndQuery
import org.vaccineimpact.api.test_helpers.MontaguTests

class PathAndQueryTests : MontaguTests()
{
    @Test
    fun `objects are equal if both have no query parameters`()
    {
        assertThat(PathAndQuery("url")).isEqualTo(PathAndQuery("url"))
    }

    @Test
    fun `objects are equal if both have same query parameters`()
    {
        val a = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        val b = PathAndQuery("url", mapOf("y" to "2", "x" to "1"))
        assertThat(a).isEqualTo(b)
    }

    @Test
    fun `objects are not equal if their query parameters differ`()
    {
        val a = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        val b = PathAndQuery("url", mapOf("x" to "2", "y" to "1"))
        assertThat(a).isNotEqualTo(b)
    }

    @Test
    fun `objects are not equal if their paths differ`()
    {
        val a = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        val b = PathAndQuery("url2", mapOf("x" to "1", "y" to "2"))
        assertThat(a).isNotEqualTo(b)
    }

    @Test
    fun `toString returns path if no query parameters`()
    {
        assertThat(PathAndQuery("url").toString()).isEqualTo("url")
    }

    @Test
    fun `toString returns url with query string if some query parameters`()
    {
        val x = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        assertThat(x.toString()).isEqualTo("url?x=1&y=2")
    }

    @Test
    fun `can construct from pac4j WebContext`()
    {
        val rawMap = mutableMapOf(
                "x" to arrayOf("1"),
                "y" to arrayOf("2", "3")
        )
        val context = mock<WebContext> {
            on { path } doReturn "url"
            on { requestParameters } doReturn rawMap
        }
        val actual = PathAndQuery.fromWebContext(context)
        val expected = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        assertThat(actual).isEqualTo(expected)
    }

    @Test
    fun `can construct from string`()
    {
        val actual = PathAndQuery.fromStringOrWildcard("url?x=1&y=2")
        val expected = PathAndQuery("url", mapOf("x" to "1", "y" to "2"))
        assertThat(actual).isEqualTo(expected)
    }

    @Test
    fun `can construct from wildcard string`()
    {
        val actual = PathAndQuery.fromStringOrWildcard("*")
        assertThat(actual).isNull()
    }
}