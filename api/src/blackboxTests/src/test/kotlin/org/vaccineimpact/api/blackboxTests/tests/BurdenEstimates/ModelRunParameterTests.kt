package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import com.beust.klaxon.JsonObject
import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addResponsibility
import org.vaccineimpact.api.db.direct.addResponsibilitySet
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import java.io.StringReader

class ModelRunParameterTests : BurdenEstimateTests()
{
    private val modelRunParameterCSV = """
"run_id", "param1", "param2"
   "1",   996,    50
   "2",   997,    50
   "3",   996,    51
   "4",   997,    51
"""

    private val modelRunParameterUrl = "/modelling-groups/$groupId/model-run-parameters/$touchstoneVersionId/"
    private val modelRunParameterCsvUrl = "$modelRunParameterUrl/1/"

    @Test
    fun `can upload model run parameter set`()
    {
        val requestHelper = RequestHelper()

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        JooqContext().use {
            setUp(it)
        }

        val response = requestHelper.postFile("$modelRunParameterUrl/",
                modelRunParameterCSV,
                token = token, data = mapOf("disease" to diseaseId))

        Assertions.assertThat(response.statusCode).isEqualTo(201)
        Assertions.assertThat(response.headers["Location"]).`as`("Location header")
                .contains("/modelling-groups/$groupId/model-run-parameters/")

    }

    @Test
    fun `returns BadRequest if request is not multipart`()
    {
        val requestHelper = RequestHelper()

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        JooqContext().use {
            setUp(it)
        }

        val response = requestHelper.post("$modelRunParameterUrl/",
                modelRunParameterCSV,
                token = token)

            JSONValidator().validateError(response.text,
                    expectedErrorCode = "bad-request",
                    expectedErrorText = "Trying to extract a part from multipart/form-data but this request is of type text/plain")
    }

    @Test
    fun `returns error if part is missing`()
    {
        val requestHelper = RequestHelper()

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        JooqContext().use {
            setUp(it)
        }

        val response = requestHelper.postFile("$modelRunParameterUrl/",
                modelRunParameterCSV,
                token = token, data = mapOf())

            JSONValidator().validateError(response.text,
                    expectedErrorCode = "missing-required-parameter:disease",
                    expectedErrorText = "You must supply a 'disease' parameter in the multipart body")
    }

    @Test
    fun `can get model run parameters`()
    {
        var setId = 0
        validate(modelRunParameterUrl) against "ModelRunParameterSets" given { db ->
            setId = setUpWithModelRunParameterSet(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckArray { data ->
            val obj = data.first() as JsonObject
            Assertions.assertThat(obj["uploaded_by"]).isEqualTo("test.user")
            Assertions.assertThat(obj["uploaded_on"]).isNotNull()
            Assertions.assertThat(obj["model"]).isEqualTo("model-1")
            Assertions.assertThat(obj["id"]).isEqualTo(setId)
            Assertions.assertThat(obj["disease"]).isEqualTo(diseaseId)
        }
    }

    @Test
    fun `download csv of model run parameters values`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            setupDatabaseWithModelRunParameterSetValues(it)
            userHelper.setupTestUser(it)
        }

        val permissions = PermissionSet(
                "*/can-login",
                "$groupScope/estimates.write",
                "$groupScope/responsibilities.read"
        )

        val response = requestHelper.get(modelRunParameterCsvUrl, permissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        val headers = csv.first().toList()
        val firstRow = csv.drop(1).first().toList()

        val expectedHeaders = listOf("run_id", "<param_1>", "<param_2>")

        headers.forEachIndexed { index, h ->
            Assertions.assertThat(h).isEqualTo(expectedHeaders[index])
        }

        Assertions.assertThat(firstRow[0]).isEqualTo("1")
        Assertions.assertThat(firstRow[1]).isEqualTo("aa")
        Assertions.assertThat(firstRow[2]).isEqualTo("bb")

        val secondRow = csv.drop(2).first().toList()

        Assertions.assertThat(secondRow[0]).isEqualTo("2")
        Assertions.assertThat(secondRow[1]).isEqualTo("cc")
        Assertions.assertThat(secondRow[2]).isEqualTo("dd")
    }

    @Test
    fun `download csv of nonexistent model run parameters returns 404`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            setUp(it)  //create touchstone, group etc, but don't set up model run parameters
            userHelper.setupTestUser(it)
        }

        val permissions = PermissionSet(
                "*/can-login",
                "$groupScope/estimates.write",
                "$groupScope/responsibilities.read"
        )

        val response = requestHelper.get(modelRunParameterCsvUrl, permissions, acceptsContentType = "text/csv")

        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }

    @Test
    fun `download csv of model run parameters belonging to another group returns 404`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val secondGroup = "group-2"
        val secondGroupScope = "modelling-group:$secondGroup"

        JooqContext().use {
            setupDatabaseWithModelRunParameterSetValues(it)
            userHelper.setupTestUser(it)

            //Make a second group, with responsibility in this touchstone. We'll query for the model run parameter set
            //created above for group-1 as if it belonged to group-2 - should get a 404 even if we set up the user to have
            //permissions for both groups
            it.addGroup(secondGroup, "another group")
            val responsibilitySetId = it.addResponsibilitySet(secondGroup,touchstoneVersionId)
            it.addResponsibility(responsibilitySetId, touchstoneVersionId, scenarioId)
        }

        val permissions = PermissionSet(
                "*/can-login",
                "$groupScope/estimates.write",
                "$groupScope/responsibilities.read",
                "$secondGroupScope/estimates.write",
                "$secondGroupScope/responsibilities.read"
        )

        val url = "/modelling-groups/$secondGroup/model-run-parameters/$touchstoneVersionId/1/"

        val response = requestHelper.get(url, permissions, acceptsContentType = "text/csv")

        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }

    @Test
    fun `download csv of model run parameters belonging to another touchstone version returns 404`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            setupDatabaseWithModelRunParameterSetValues(it)
            userHelper.setupTestUser(it)

            //add a second touchstone
            it.addTouchstoneVersion("anothertouchstone", 1, "Another Touchstone", addTouchstone = true)
        }

        val permissions = PermissionSet(
                "*/can-login",
                "$groupScope/estimates.write",
                "$groupScope/responsibilities.read"
        )

        //query for the model run parameter set as if it was in the other touchstone
        val url = "/modelling-groups/$groupId/model-run-parameters/anothertouchstone-1/1/"
        val response = requestHelper.get(url, permissions, acceptsContentType = "text/csv")

        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }

}