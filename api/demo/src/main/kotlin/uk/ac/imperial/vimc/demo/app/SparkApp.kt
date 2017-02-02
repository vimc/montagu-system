package uk.ac.imperial.vimc.demo.app

import com.github.salomonbrys.kotson.registerTypeAdapter
import com.google.gson.FieldNamingPolicy
import com.google.gson.GsonBuilder
import org.slf4j.LoggerFactory
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.StaticModellingGroups
import uk.ac.imperial.vimc.demo.app.models.StaticScenarios
import uk.ac.imperial.vimc.demo.app.serialization.LocalDateSerializer
import uk.ac.imperial.vimc.demo.app.viewmodels.ImpactEstimateAndGroup
import uk.ac.imperial.vimc.demo.app.viewmodels.ModellingGroupAndEstimateListing
import uk.ac.imperial.vimc.demo.app.viewmodels.ModellingGroupMetadata
import uk.ac.imperial.vimc.demo.app.viewmodels.ScenarioMetadata
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
        spk.get("$urlBase/scenarios/", scenarios::getAllScenarios, this::toJson)
        spk.get("$urlBase/scenarios/:id/", scenarios::getScenario, this::toJson)
        val modellers = ModellingGroupController()
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, this::toJson)
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, this::toJson)
        spk.get("$urlBase/modellers/:id/estimates/", modellers::getAllEstimates, this::toJson)
        spk.get("$urlBase/modellers/:id/estimates/:estimate-id/", modellers::getEstimate, this::toJson)

        spk.after("*", { req, res -> res.type("application/json") })
    }

    fun toJson(x: Any): String = gson.toJson(x)
}

class ScenarioController {
    fun getAllScenarios(req: Request, res: Response): List<ScenarioMetadata> {
        return StaticScenarios.all.map(::ScenarioMetadata)
    }
    fun getScenario(req: Request, res: Response): Scenario {
        val id = req.params(":id")
        return StaticScenarios.all.single { it.id == id }
    }
}

class ModellingGroupController {
    fun getAllModellingGroups(req: Request, res: Response): List<ModellingGroupMetadata> {
        return StaticModellingGroups.all.map(::ModellingGroupMetadata)
    }
    fun getAllEstimates(req: Request, res: Response): ModellingGroupAndEstimateListing {
        val id = req.params(":id")
        val group = StaticModellingGroups.all.single { it.id == id }
        return ModellingGroupAndEstimateListing(group)
    }
    fun getEstimate(req: Request, res: Response): ImpactEstimateAndGroup {
        val id = req.params(":id")
        val group = StaticModellingGroups.all.single { it.id == id }
        val estimateId = req.params(":estimate-id").toInt()
        val estimate = group.estimates.single { it.id == estimateId }
        return ImpactEstimateAndGroup(group, estimate)
    }
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