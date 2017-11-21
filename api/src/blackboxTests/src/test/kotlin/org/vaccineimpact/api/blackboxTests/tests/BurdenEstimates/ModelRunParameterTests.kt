package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.getResultFromRedirect
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.validateSchema.JSONValidator

class ModelRunParameterTests : BurdenEstimateTests()
{
    val modelRunParameterCSV = """
"run_id", "param1", "param2"
   "1",   996,    50
   "2",   997,    50
   "3",   996,    51
   "4",   997,    51
"""

    @Test
    fun `can upload model run parameter set`()
    {
        validate("$urlBase/model-run-parameters/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, modelRunParameterCSV, data=mapOf("description" to "description"))
            Assertions.assertThat(response.statusCode).isEqualTo(201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

    @Test
    fun `throws BadRequest if request is not multipart`()
    {
        validate("$urlBase/model-run-parameters/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.post(oneTimeURL, modelRunParameterCSV)

            JSONValidator().validateError(response.text,
                    expectedErrorCode = "bad-request",
                    expectedErrorText = "This endpoint expects multipart/form-data but this request is of type text/plain")
        }
    }

    @Test
    fun `throws BadRequest if part is missing`()
    {
        validate("$urlBase/model-run-parameters/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, modelRunParameterCSV)

            JSONValidator().validateError(response.text,
                    expectedErrorCode = "bad-request",
                    expectedErrorText = "No value passed for required POST parameter 'description'")
        }
    }



    @Test
    fun `can upload model run parameters via onetime link and redirect`()
    {
        validate("$urlBase/model-run-parameters/get_onetime_link/?redirectUrl=http://localhost") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, modelRunParameterCSV, data=mapOf("description" to "description"))
            val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
            JSONValidator().validateSuccess(resultAsString)
        }

    }
}