package org.vaccineimpact.api.app.context

import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.profile.ProfileManager
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.errors.ValidationError
import org.vaccineimpact.api.app.security.montaguPermissions
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.serialization.ModelBinder
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.validation.ValidationException
import spark.Request
import spark.Response
import java.io.OutputStream
import java.io.Reader
import java.util.zip.GZIPOutputStream
import javax.servlet.MultipartConfigElement
import kotlin.reflect.KClass

class DirectActionContext(private val context: SparkWebContext,
                          private val serializer: Serializer = MontaguSerializer.instance) : ActionContext
{
    override val request
        get() = context.sparkRequest
    private val response
        get() = context.sparkResponse

    constructor(request: Request, response: Response)
            : this(SparkWebContext(request, response))

    override fun contentType(): String = request.contentType()
    override fun queryParams(key: String): String? = request.queryParams(key)
    override fun queryString(): String? = request.queryString()
    override fun params(): Map<String, String> = request.params()
    override fun params(key: String): String = request.params(key)
    override fun <T : Any> postData(klass: Class<T>): T
    {
        return try
        {
            ModelBinder().deserialize(request.body(), klass)
        }
        catch (e: ValidationException)
        {
            throw ValidationError(e.errors)
        }
    }

    override fun getPart(name: String): Reader
    {
        val contentType = request.contentType()
        if (!contentType.startsWith("multipart/form-data"))
        {
            throw BadRequest("Trying to extract a part from multipart/form-data but this request is of type $contentType")
        }

        if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
        {
            val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
            request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
        }

        val part = request.raw().getPart(name)
                ?: throw BadRequest("No value passed for required POST parameter '$name'")

        return part.inputStream.bufferedReader()
    }

    override fun <T : Any> csvData(klass: KClass<T>, from: RequestBodySource): Sequence<T>
    {
        return try
        {
            DataTableDeserializer.deserialize(from.getContent(this), klass, serializer)
        }
        catch (e: ValidationException)
        {
            throw ValidationError(e.errors)
        }
    }

    override fun setResponseStatus(status: Int)
    {
        response.status(status)
    }

    override fun addResponseHeader(key: String, value: String)
    {
        response.header(key, value)
    }

    override fun addAttachmentHeader(filename: String)
    {
        addResponseHeader("Content-Disposition", """attachment; filename="$filename"""")
    }

    override fun hasPermission(requirement: ReifiedPermission): Boolean
    {
        return if (Config.authEnabled)
        {
            permissions.any { requirement.satisfiedBy(it) }
        }
        else
        {
            true
        }
    }

    override fun requirePermission(requirement: ReifiedPermission)
    {
        if (!hasPermission(requirement))
        {
            throw MissingRequiredPermissionError(setOf(requirement.toString()))
        }
    }

    override val permissions by lazy {
        userProfile!!.montaguPermissions()
    }

    override val userProfile: CommonProfile? by lazy {
        val manager = ProfileManager<CommonProfile>(context)
        manager.getAll(false).singleOrNull()
    }
    override val username = userProfile?.id

    override fun streamedResponse(contentType: String, work: (OutputStream) -> Unit)
    {
        addDefaultResponseHeaders(response, contentType)
        val stream = response.raw().outputStream
        GZIPOutputStream(stream, BUFFER_SIZE).use { zipStream ->
            work(zipStream)
        }
    }

    override fun redirect(url: String)
    {
        this.response.redirect(url)
    }
}

// https://stackoverflow.com/a/19032439/777939
// This is the default buffer size for BufferedOutputStream; GZipOutputStream uses a smaller value
// by default, and this leads to worse performance.
private const val BUFFER_SIZE = 8000