package org.vaccineimpact.api.validateSchema

class ExampleParsingException(inner: Exception)
    : Exception("An error occurred parsing the example JSON: " + inner, inner)