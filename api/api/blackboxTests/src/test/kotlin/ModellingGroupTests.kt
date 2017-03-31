
import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.main.JsonSchemaFactory
import khttp.get
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModellingGroupTests : MontaguTests()
{
    @Test
    fun `modelling-groups matches schema`()
    {
        val hostUrl = "http://localhost:8080"
        val baseUrl = "v1"
        val root = "$hostUrl/$baseUrl"

        // Need to set up a temporary database in a known state
        /*JooqContext().use {
            it.addGroup("group-id", "group description")
        }*/

        val response = get("$root/modelling-groups/")

        // Need to first check it conforms to Result.schema.json
        val schemaJson = JsonLoader.fromPath("/home/me06/projects/vimc/api/spec/ModellingGroups.schema.json")
        // Need to pull out the 'data' field of the generic result
        val json = JsonLoader.fromString(response.text)
        val schemaFactory = JsonSchemaFactory.byDefault()
        val schema = schemaFactory.getJsonSchema(schemaJson)
        val report = schema.validate(json)
        println(report)
        assertThat(report.isSuccess).isTrue()
    }
}