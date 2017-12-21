package org.vaccineimpact.api.tests.controllers

import com.beust.klaxon.json
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.apache.commons.fileupload.FileItemStream
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.pac4j.core.context.Pac4jConstants
import org.pac4j.core.profile.CommonProfile
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.MultipartData
import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.security.PERMISSIONS
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.tests.mocks.MockServletInputStream
import spark.Request
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.io.StringReader
import javax.servlet.ServletInputStream
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.Part

class DirectActionContextTests : MontaguTests()
{
    @Test
    fun `can get user profile`()
    {
        val profile = CommonProfile()
        val context = DirectActionContext(mockWebContext(profile))
        assertThat(context.userProfile).isEqualTo(profile)
    }

    @Test
    fun `can get user permissions`()
    {
        val profile = CommonProfile().apply {
            addAttribute(PERMISSIONS, PermissionSet(
                    "*/can-login",
                    "modelling-group:IC-Garske/coverage.read"
            ))
        }
        val context = DirectActionContext(mockWebContext(profile))
        assertThat(context.permissions).hasSameElementsAs(listOf(
                ReifiedPermission("can-login", Scope.Global()),
                ReifiedPermission("coverage.read", Scope.Specific("modelling-group", "IC-Garske"))
        ))
    }

    @Test
    fun `requirePermission throws exception is user does not have permission`()
    {
        val profile = CommonProfile().apply {
            addAttribute(PERMISSIONS, PermissionSet(
                    "*/can-login"
            ))
        }
        val context = DirectActionContext(mockWebContext(profile))
        // Does not throw exception
        context.requirePermission(ReifiedPermission.parse("*/can-login"))
        assertThatThrownBy { context.requirePermission(ReifiedPermission.parse("*/can-dance")) }
                .hasMessageContaining("*/can-dance")
    }

    data class Model(val a: Int, val b: List<String>, val c: Model?)

    @Test
    fun `can deserialize post data`()
    {
        val body = json {
            obj(
                    "a" to 1,
                    "b" to array("x", "y"),
                    "c" to obj(
                            "a" to 100,
                            "b" to array("z")
                    )
            )
        }
        val mockRequest = mock<Request> {
            on { body() } doReturn body.toJsonString(prettyPrint = true)
        }
        val mockWebContext = mock<SparkWebContext> {
            on { sparkRequest } doReturn mockRequest
        }
        val context = DirectActionContext(mockWebContext)
        val model = context.postData<Model>()
        assertThat(model).isEqualTo(Model(1, listOf("x", "y"), Model(100, listOf("z"), null)))
    }

    @Test
    fun `throws BadRequest if getPart called on non multipart request`()
    {
        val mockData = mock<MultipartData> {
            on { isMultipartContent(any()) } doReturn false
        }
        val context = DirectActionContext(mockWebContext(contentType = "some/content/type"))
        assertThatThrownBy { context.getPart("partB", mockData) }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("Trying to extract a part from multipart/form-data but this request is of type some/content/type")
    }

    @Test
    fun `throw BadRequest if getPart called on non existent part`()
    {
        val data = sequenceOf(
                mockFileItem("partA", "Message A"),
                mockFileItem("partC", "Message C")
        )
        val mockData = mock<MultipartData> {
            on { isMultipartContent(any()) } doReturn true
            on { parts(any()) } doReturn data
        }
        val context = DirectActionContext(mockWebContext())
        assertThatThrownBy { context.getPart("partB", mockData) }
                .isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("No value passed for required POST parameter 'partB'")
    }

    @Test
    fun `can get part`()
    {
        val data = sequenceOf(
                mockFileItem("partA", "Message A"),
                mockFileItem("partB", "Message B"),
                mockFileItem("partC", "Message C")
        )
        val mockData = mock<MultipartData> {
            on { isMultipartContent(any()) } doReturn true
            on { parts(any()) } doReturn data
        }
        val context = DirectActionContext(mockWebContext())
        assertThat(context.getPart("partB", mockData).readText()).isEqualTo("Message B")
    }

    private fun mockFileItem(name: String, contents: String): FileItemStream
    {
        return mock {
            on { fieldName } doReturn name
            on { openStream() } doReturn ByteArrayInputStream(contents.toByteArray())
        }
    }

    private fun mockWebContext(profile: CommonProfile? = null, contentType: String? = null): SparkWebContext
    {
        val mockServletRequest = mock<HttpServletRequest>()
        val mockRequest = mock<Request> {
            on { raw() } doReturn mockServletRequest
            on { contentType() } doReturn contentType
        }
        return mock {
            on { sparkRequest } doReturn mockRequest
            on { getRequestAttribute(Pac4jConstants.USER_PROFILES) } doReturn profile
        }
    }
}