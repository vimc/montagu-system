package uk.ac.imperial.vimc.demo.app

import com.google.gson.JsonSyntaxException
import org.slf4j.LoggerFactory
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.controllers.ModellingGroupController
import uk.ac.imperial.vimc.demo.app.controllers.ScenarioController
import uk.ac.imperial.vimc.demo.app.repositories.FakeDataRepository
import uk.ac.imperial.vimc.demo.app.repositories.Repository
import java.net.URL
import spark.Spark as spk

fun main(args: Array<String>) {
    DemoApp().run()
}

class DemoApp {
    private val urlBase = "/v1"
    private val logger = LoggerFactory.getLogger(DemoApp::class.java)

    fun run() {
        spk.port(8080)

        spk.exception(Exception::class.java) { e, req, res ->
            logger.error("An unhandled exception occurred", e)
            res.body("An error occurred: $e")
        }
        spk.exception(JsonSyntaxException::class.java) { e, req, res ->
            res.body("Error: Unable to parse supplied JSON: ${req.body()}")
        }

        spk.redirect.get("/", urlBase)
        spk.before("*", this::addTrailingSlashes)

        val db: Repository = FakeDataRepository()
        spk.get("$urlBase/", { req, res -> "root.json" }, this::fromFile)
        val scenarios = ScenarioController(db)
        spk.get("$urlBase/scenarios/", scenarios::getAllScenarios, this::toJson)
        spk.get("$urlBase/scenarios/:scenario-id/", scenarios::getScenario, this::toJson)
        spk.get("$urlBase/scenarios/:scenario-id/countries/", scenarios::getCountriesInScenario, this::toJson)
        val modellers = ModellingGroupController(db)
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, this::toJson)
        spk.get("$urlBase/modellers/", modellers::getAllModellingGroups, this::toJson)
        spk.get("$urlBase/modellers/:group-id/estimates/", modellers::getAllEstimates, this::toJson)
        spk.get("$urlBase/modellers/:group-id/estimates/:estimate-id/", modellers::getEstimate, this::toJson)
        spk.post("$urlBase/modellers/:group-id/estimates/", modellers::createEstimate, this::toJson)

        spk.after("*", { req, res ->
            res.type("application/json")
            res.header("Content-Encoding", "gzip")
        })
    }

    fun toJson(x: Any): String = Serializer.gson.toJson(x)

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
}