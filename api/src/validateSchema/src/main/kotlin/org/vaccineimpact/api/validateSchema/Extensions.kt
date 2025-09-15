package org.vaccineimpact.api.validateSchema

import org.commonmark.node.Node
import org.commonmark.node.Text

fun Node.children(): Sequence<Node>
{
    if (this.firstChild != null)
    {
        return sequenceOf(this.firstChild) + this.firstChild.siblings()
    }
    else
    {
        return emptySequence()
    }
}

fun Node.siblings(): Sequence<Node>
{
    var node: Node? = this
    return generateSequence {
        node = node?.next
        node
    }
}


fun Node.text(): String
{
    val nodes = listOf(this) + this.children()
    return nodes.filterIsInstance<Text>().map { it.literal }.joinToString("")
}