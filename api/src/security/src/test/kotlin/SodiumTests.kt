import org.junit.Test
import org.vaccineimpact.api.security.SodiumPasswordEncoder

class SodiumTests {
    @Test
    fun `hashes password`() {

        val encoder = SodiumPasswordEncoder()
        val testPassword = "this is a password"

        val hashedPw = encoder.encode(testPassword)
        val decodedPw = encoder.matches(testPassword, hashedPw)

        assert(decodedPw)

    }

}
