package uk.ac.imperial.vimc.demo.app

import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.FieldNamingPolicy
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.slf4j.LoggerFactory
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.serialization.LocalDateSerializer
import uk.ac.imperial.vimc.demo.app.serialization.ScenarioIdSerializer
import java.net.URL
import spark.Spark as spk

fun main(args: Array<String>) {
    DemoApp().run()
}

class DemoApp {
    private val gsonBuilder = GsonBuilder()
            .setPrettyPrinting()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapter(LocalDateSerializer())
    private val gson = gsonBuilder.create()
    private val urlBase = "/v1"
    private val logger = LoggerFactory.getLogger(DemoApp::class.java)

    fun run() {
        spk.port(8080)

        spk.exception(Exception::class.java) { e, req, res ->
            logger.error("An unhandled exception occurred", e)
            res.body("An error occurred")
        }

        spk.redirect.get("/", urlBase)
        spk.before("*", ::addTrailingSlashes)

        spk.get("$urlBase/",               { req, res -> "root.json" }, ::fromFile)
        val scenarios = ScenarioController()
        scenarios.get("$urlBase/scenarios/", scenarios.getAllScenarios)
        scenarios.get("$urlBase/scenarios/:id/", scenarios.getScenario)
        val modellers = ModellingGroupController()
        modellers.get("$urlBase/modellers/", modellers.getAllModellingGroups)
        modellers.get("$urlBase/modellers/:id/estimates/", modellers.getAllEstimates)
        modellers.get("$urlBase/modellers/:id/estimates/:estimate-id/", modellers.getEstimate)

        spk.after("*", { req, res -> res.type("application/json") })
    }
}

abstract class Controller {
    protected fun gsonBuilder() = GsonBuilder()
            .setPrettyPrinting()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .registerTypeAdapter(LocalDateSerializer())
    protected val defaultGson : Gson = gsonBuilder().create()

    fun get(path: String, handler: Handler) {
        spk.get(path, handler.route, { handler.transformer.toJson(it) })
    }

    protected fun handler(route: (Request, Response) -> Any) = handler(route, defaultGson)
    protected fun handler(route: (Request, Response) -> Any, transformer: Gson) = Handler(route, transformer)
    protected fun handler(route: (Request, Response) -> Any, build: (GsonBuilder) -> GsonBuilder): Handler {
        val newBuilder = build(gsonBuilder())
        return handler(route, newBuilder.create())
    }
}

class Handler(val route: (Request, Response) -> Any, val transformer: Gson) {
}

class ScenarioController : Controller() {
    val getAllScenarios = handler({ req, res -> StaticScenarios.all })
    val getScenario = handler(
            { req, res ->
                val id = req.params(":id")
                val scenario = StaticScenarios.all.single { it.id == id }
                ScenarioWithData(scenario, StaticCountries.all, StaticData.defaultYears)
            }
    )
}

class ModellingGroupController : Controller() {
    val getAllModellingGroups = handler({ req, res -> StaticModellingGroups.all.map { it.metadata() } })
    val getAllEstimates = handler(
            { req, res ->
                val id = req.params(":id")
                val group = StaticModellingGroups.all.single { it.id == id }
                ModellingGroupWithEstimateListing(group)
            },
            { it.registerTypeAdapter(ScenarioIdSerializer()) }
    )
    val getEstimate = handler(
            { req, res ->
                val id = req.params(":id")
                val group = StaticModellingGroups.all.single { it.id == id }
                val estimateId = req.params(":estimate-id").toInt()
                val estimate = group.estimates.single { it.id == estimateId }
                EstimateWithGroup(group.metadata(), estimate)
            }
    )
}

fun fromFile(fileName: Any): String {
    if (fileName is String) {
        val url: URL? = DemoApp::class.java.classLoader.getResource(fileName)
        if (url != null) {
            return url.readText()
        } else {
            return "Unknown file name '$fileName'"
        }
    } else {
        throw Exception("Unable to use $fileName as a file name")
    }
}

fun addTrailingSlashes(req: Request, res: Response) {
    if (!req.pathInfo().endsWith("/")) {
        var path = req.pathInfo() + "/"
        if (req.queryString() != null) {
            path += "/?" + req.queryString()
        }
        res.redirect(path)
    }
}