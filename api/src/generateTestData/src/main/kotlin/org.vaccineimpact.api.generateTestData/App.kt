package org.vaccineimpact.api.generateTestData

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.StandardRoles
import org.vaccineimpact.api.db.direct.*
import javax.print.DocFlavor

/** The more important source set here is blackboxTests/src/test - that actually contains the
 * Black box tests. This "main" source set is just a place to put a little script you can
 * run to set up the database in a given state for manual testing. It's expected this code
 * changes frequently to allow developers to run arbitrary code against their development db.
 */
fun main(args: Array<String>) {
    JooqContext().use { db ->
        db.addDisease("YF", "Yellow Fever")
        db.addVaccine("YF", "Yellow Fever")
        db.addSupportLevels("none", "without", "with")
        db.addActivityTypes("none", "routine", "campaign")

        db.addScenarioDescription("yf-routine", "Yellow Fever, routine", "YF")
        db.addScenarioDescription("yf-campaign", "Yellow Fever, campaign", "YF")

        db.addTouchstoneName("op-2017", "Operational Forecast 2017")
        db.addTouchstone("op-2017", 1, "Operational Forecast 2017 (v1)", "finished", addStatus = true)
        db.addTouchstone("op-2017", 2, "Operational Forecast 2017 (v2)", "open", addStatus = true)

        DemographicTestData(db).generate("op-2017-1", listOf("YF"))
        DemographicTestData(db).generate("op-2017-2", listOf("YF"))

        val yfRoutine = db.addScenarioToTouchstone("op-2017-2", "yf-routine")
        val yfCampaign = db.addScenarioToTouchstone("op-2017-2", "yf-campaign")

        val yfNoVacc = db.addCoverageSet("op-2017-2", "Yellow Fever, no vaccination", "YF", "none", "none")
        val yfRoutineWithout = db.addCoverageSet("op-2017-2", "Yellow Fever, routine, without GAVI", "YF", "without", "routine")
        val yfRoutineWith = db.addCoverageSet("op-2017-2", "Yellow Fever, routine, with GAVI", "YF", "with", "routine")
        val yfCampaignWithout = db.addCoverageSet("op-2017-2", "Yellow Fever, campaign, without GAVI", "YF", "without", "campaign")
        val yfCampaignWith = db.addCoverageSet("op-2017-2", "Yellow Fever, campaign, with GAVI", "YF", "with", "campaign")
        db.generateCoverageData(yfNoVacc)
        db.generateCoverageData(yfRoutineWithout)
        db.generateCoverageData(yfRoutineWith)
        db.generateCoverageData(yfCampaignWithout)
        db.generateCoverageData(yfCampaignWith)

        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfNoVacc, 0)
        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfRoutineWithout, 1)
        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfRoutineWith, 2)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfNoVacc, 0)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfRoutineWithout, 1)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfRoutineWith, 2)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfCampaignWithout, 3)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfCampaignWith, 4)

        db.addGroup("IC-Garske", "Imperial Yellow Fever modelling group")
        db.addGroup("IC-Imaginary", "Imperial speculative modelling group")
        val setId = db.addResponsibilitySet("IC-Garske", "op-2017-2", "incomplete", addStatus = true)
        db.addResponsibility(setId, yfRoutine)
        db.addResponsibility(setId, yfCampaign)

        // note these roles are the real standard roles for the live db, not just test data!
        StandardRoles.insertInto(db)

    }
}

class DemographicTestData(val db: JooqContext)
{
    val sources = listOf("unwpp2015", "unwpp2017")
    val variants = listOf("low", "medium", "high")
    val statisticTypeIds = listOf("tot-pop", "tot-births")
    val countries = db.generateCountries(3)
    val sourceIds = db.generateDemographicSources(sources)
    val variantIds = db.generateDemographicVariants(variants)
    val units = db.generateDemographicUnits()
    val genderIds = db.generateGenders()

    fun generate(touchstoneId: String, diseases: List<String>)
    {
        db.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)
        for (disease in diseases)
        {
            db.addTouchstoneCountries(touchstoneId, countries, disease)
        }

        for (typeId in statisticTypeIds)
        {
            val type = db.addDemographicStatisticType(typeId, variantIds, units)
            for (sourceId in sourceIds)
            {
                for (gender in genderIds)
                {
                    for (variant in variantIds)
                    {
                        db.generateDemographicData(sourceId, type,
                                genderId = gender,
                                variantId = variant,
                                countries = countries
                        )
                    }
                }
            }
        }
    }
}