import org.vaccineimpact.api.db.Config

class EndpointBuilder
{
    val hostUrl = Config["app.url"]
    val baseUrl = "v1"
    val root = "$hostUrl/$baseUrl"

    fun build(url: String) = root + url
}