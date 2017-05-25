package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData

class SplitDataEndpoint<out Meta, Row : Any>(
        endpoint: EndpointDefinition<SplitData<Meta, Row>>
) : EndpointDefinition<SplitData<Meta, Row>> by endpoint
{
    override fun transform(x: Any): String
    {
        // We know x will always be T, as it is the output of route
        // We don't want to put T in the interface, as that would lose our covariant status
        @Suppress("UNCHECKED_CAST")
        return (x as SplitData<Meta, Row>).serialize(Serializer.instance)
    }
}

fun <Meta, Row : Any> EndpointDefinition<SplitData<Meta, Row>>.withSplitData(): SplitDataEndpoint<Meta, Row>
{
    return SplitDataEndpoint(this)
}
