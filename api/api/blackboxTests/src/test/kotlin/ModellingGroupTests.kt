
import com.fasterxml.jackson.databind.JsonNode
import com.github.fge.jackson.JsonLoader
import com.github.fge.jsonschema.main.JsonSchemaFactory
import khttp.get
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ModellingGroupTests : DatabaseTest()
{
    @Test
    fun `modelling-groups matches schema`()
    {
        val hostUrl = "http://localhost:8080"
        val baseUrl = "v1"
        val root = "$hostUrl/$baseUrl"

        JooqContext().use {
            it.addGroup("group-id", "group description")
        }

        val response = get("$root/modelling-groups/")

        val resultSchema = JsonLoader.fromPath("/home/me06/projects/vimc/api/spec/Response.schema.json")
        val dataSchema = JsonLoader.fromPath("/home/me06/projects/vimc/api/spec/ModellingGroups.schema.json")
        val json = JsonLoader.fromString(response.text)
        validate(resultSchema, json)
        val data = json["data"]
        validate(dataSchema, data)
    }

    private fun validate(schema: JsonNode, json: JsonNode)
    {
        val schemaFactory = JsonSchemaFactory.byDefault()
        val report = schemaFactory.getJsonSchema(schema).validate(json)
        println(report)
        assertThat(report.isSuccess).isTrue()
    }
}