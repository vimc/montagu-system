package org.vaccineimpact.api.validateSchema

import org.commonmark.node.Heading
import org.commonmark.node.IndentedCodeBlock
import org.commonmark.node.Link
import org.commonmark.node.Node

class Endpoint(val method: String, val urlTemplate: String, contents: List<Node>)
{
    val requestSchemas: List<SchemaDefinition>

    init
    {
        val schemaBlocks = contents.filter { it.text().startsWith("Schema: ") }
        requestSchemas = schemaBlocks.map { getRequestSchema(it) }
    }

    private fun getRequestSchema(schemaBlock: Node): SchemaDefinition
    {
        val link = schemaBlock.children().filterIsInstance<Link>().first()

        val exampleHeader = schemaBlock.siblings().firstOrNull { it is Heading && it.text() == "Example" }
        if (exampleHeader == null)
        {
            throw Exception("Missing example for schema ${link.destination} in $this")
        }
        else
        {
            val exampleBlock = exampleHeader.siblings().filterIsInstance<IndentedCodeBlock>().first()
            return SchemaDefinition(link.destination, exampleBlock.literal)
        }
    }

    override fun toString(): String
    {
        return "$method: $urlTemplate"
    }

    companion object
    {
        val methods = listOf("GET", "POST", "PATCH", "PUT")
        val methodPattern = methods.joinToString("|")
        val endpointRegex = Regex("(?<method>${methodPattern}) (?<urlTemplate>.+)")

        fun asEndpoint(node: Node): Endpoint?
        {
            if (node is Heading)
            {
                val headingText = node.text()
                val match = endpointRegex.find(headingText)
                val contents = node.siblings().takeWhile { it !is Heading || it.level > node.level }
                if (match != null)
                {
                    val method = match.groups["method"]!!.value
                    val urlTemplate = match.groups["urlTemplate"]!!.value
                    return Endpoint(method, urlTemplate, contents.toList())
                }
                else if (headingText == "Standard response format")
                {
                    return Endpoint("", "<Standard response format>", contents.toList())
                }
            }
            return null
        }
    }
}