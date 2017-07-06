import org.junit.Test
import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.security.SodiumPasswordEncoder

class SodiumTests {
    @Test
    fun `hashes password`() {

        val encoder = SodiumPasswordEncoder()
        val testPassword = "this is a password"

        val hashedPw = encoder.encode(testPassword)
        val verified = encoder.matches(testPassword, hashedPw)

        assertThat(verified).isTrue()
    }

}
