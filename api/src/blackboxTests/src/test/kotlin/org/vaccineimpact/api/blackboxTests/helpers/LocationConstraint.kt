package org.vaccineimpact.api.blackboxTests.helpers

import khttp.responses.Response
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat

data class LocationConstraint(val urlFragment: String, val unknownId: Boolean = false)
{
    fun checkObjectCreation(response: Response): String
            = checkObjectCreation(response, response.montaguData<String>()!!)

    fun checkObjectCreation(response: Response, body: String): String
    {
        val expectedPath = EndpointBuilder.buildPath(urlFragment)
        assertThat(response.statusCode).`as`("Status code").isEqualTo(201)
        val thingsToCheck = listOf(
                Assertions.assertThat(response.headers["Location"]).`as`("Location header"),
                Assertions.assertThat(body).`as`("Body")
        )
        thingsToCheck.forEach {
            if (unknownId)
            {
                it.contains(expectedPath)
            }
            else
            {
                it.endsWith(expectedPath)
            }
        }

        val idRegex = Regex("""\/([a-zA-Z0-9-]+)\/$""")
        val id = idRegex.find(body)?.groups?.get(1)?.value
        if (id != null)
        {
            return id
        }
        else
        {
            throw Exception("Unable to extract object ID from '$body'")
        }
    }
}
