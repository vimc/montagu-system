
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.test_helpers.DatabaseTest

class DiseaseTests : DatabaseTest()
{
    @Test
    fun `can get diseases`()
    {
        validate("/diseases/") against "Diseases" given {
            it.addDisease("HepB", "Hepatitis B")
            it.addDisease("YF", "Yellow Fever")
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(2)
            Assertions.assertThat(it).contains(json { obj(
                    "id" to "HepB",
                    "name" to "Hepatitis B"
            )})
        }
    }

    @Test
    fun `can get disease`()
    {
        validate("/diseases/HepB/") against "Disease" given {
            it.addDisease("HepB", "Hepatitis B")
            it.addDisease("YF", "Yellow Fever")
        } andCheck {
            Assertions.assertThat(it).isEqualTo(json { obj(
                    "id" to "HepB",
                    "name" to "Hepatitis B"
            )})
        }
    }
}