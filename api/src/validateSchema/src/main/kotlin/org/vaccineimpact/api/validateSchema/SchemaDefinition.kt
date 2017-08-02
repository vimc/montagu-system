package org.vaccineimpact.api.validateSchema

data class SchemaDefinition(val schemaPath: String, val example: String)
{
    val schema by lazy {
        val resource = ResourceHelper.getResource("spec/" + schemaPath)
        resource.readText()
    }

    override fun toString(): String
    {
        return "$schemaPath (Example begins: ${example.take(100).replace("\n", " ")}..."
    }
}