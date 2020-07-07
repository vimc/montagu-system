package org.vaccineimpact.api.generateTestData

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

fun main(args: Array<String>) {


    JooqContext().use { db ->

        val demographicTestData = DemographicTestData(db)

        db.addDisease("YF", "Yellow Fever")
        db.addVaccine("YF", "Yellow Fever")

        db.addScenarioDescription("yf-routine", "Yellow Fever, routine", "YF", "routine")
        db.addScenarioDescription("yf-campaign", "Yellow Fever, campaign", "YF", "campaign")

        db.addGroup("IC-Garske", "Imperial Yellow Fever modelling group")
        db.addGroup("IC-Imaginary", "Imperial speculative modelling group")
        db.addModel("yf-model", "IC-Garske", "YF", "Yellow Fever Model",
                versions = listOf("v1"), countries=db.fetchCountries(96))

        db.addTouchstone("op-2017", "Operational Forecast 2017")

        addAllTestDataForOp2017v1(db, demographicTestData)
        addAllTestDataForOp2017v2(db, demographicTestData)

        db.addTouchstone("op-2018", "Operational Forecast 2018")

        addAllTestDataForOp2018v1(db, demographicTestData)

        db.addTouchstone("fake-rfp", "Fake request for proposals")
        db.addTouchstoneVersion("fake-rfp", 1, "Fake request for proposals (v1)", "finished")

        db.addTouchstone("future", "Future touchstone")
        db.addTouchstoneVersion("future", 1, "Future (v1)", "in-preparation")

        db.addUserForTesting("test.user")
    }

}

fun addAllTestDataForOp2017v1(db: JooqContext, demographicTestData: DemographicTestData){
    //Add all test data and relationships for Touchstone Version "op-2017-1"
    db.addTouchstoneVersion("op-2017", 1, "Operational Forecast 2017 (v1)", "finished")

    demographicTestData.generate("op-2017-1", listOf("YF"))

    val yfRoutine = db.addScenarioToTouchstone("op-2017-1", "yf-routine")
    val yfCampaign = db.addScenarioToTouchstone("op-2017-1", "yf-campaign")

    val yfNoVacc = db.addCoverageSet("op-2017-1", "Yellow Fever, no vaccination", "YF", "none", "none")
    val yfRoutineWithout = db.addCoverageSet("op-2017-1", "Yellow Fever, routine, without GAVI", "YF", "without", "routine")
    db.generateCoverageData(yfNoVacc)
    db.generateCoverageData(yfRoutineWithout)

    db.addCoverageSetToScenario("yf-routine", "op-2017-1", yfNoVacc, 3)
    db.addCoverageSetToScenario("yf-routine", "op-2017-1", yfRoutineWithout, 4)

    val setId = db.addResponsibilitySet("IC-Garske", "op-2017-1", "incomplete")
    val responsibilityId = db.addResponsibility(setId, yfRoutine)
    val secondResponsibilityId = db.addResponsibility(setId, yfCampaign)

    db.addExpectations(responsibilityId, countries = db.fetchCountries(2), outcomes = db.fetchOutcomes(2),
            cohortMinInclusive = 1980, cohortMaxInclusive = null)
    db.addExpectations(secondResponsibilityId, countries = db.fetchCountries(96), outcomes = db.fetchOutcomes(1))

}

fun addAllTestDataForOp2017v2(db: JooqContext, demographicTestData: DemographicTestData){
    //Add all test data and relationships for Touchstone Version "op-2017-2"
    db.addTouchstoneVersion("op-2017", 2, "Operational Forecast 2017 (v2)", "open")

    demographicTestData.generate("op-2017-2", listOf("YF"))

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

    val setId = db.addResponsibilitySet("IC-Garske", "op-2017-2", "incomplete")
    val responsibilityId = db.addResponsibility(setId, yfRoutine)
    val secondResponsibilityId = db.addResponsibility(setId, yfCampaign)

    db.addExpectations(responsibilityId, countries = db.fetchCountries(2), outcomes = db.fetchOutcomes(6),
            cohortMinInclusive = 1980, cohortMaxInclusive = null)
    db.addExpectations(secondResponsibilityId, countries = db.fetchCountries(96), outcomes = db.fetchOutcomes(1))

}

fun addAllTestDataForOp2018v1(db: JooqContext, demographicTestData: DemographicTestData){
    //Add all test data and relationships for Touchstone Version "op-2018-1"
    db.addTouchstoneVersion("op-2018", 1, "Operational Forecast 2018 (v1)", "open")

    demographicTestData.generate("op-2018-1", listOf("YF"))
    val yfRoutine2018 = db.addScenarioToTouchstone("op-2018-1", "yf-routine")
    val yfCampaign2018 = db.addScenarioToTouchstone("op-2018-1", "yf-campaign")

    val yfNoVacc2018 = db.addCoverageSet("op-2018-1", "Yellow Fever, no vaccination", "YF", "none", "none")
    val yfRoutineWithout2018 = db.addCoverageSet("op-2018-1", "Yellow Fever, routine, without GAVI", "YF", "without", "routine")
    db.generateCoverageData(yfNoVacc2018)
    db.generateCoverageData(yfRoutineWithout2018)

    db.addCoverageSetToScenario("yf-routine", "op-2018-1", yfNoVacc2018, 3)
    db.addCoverageSetToScenario("yf-routine", "op-2018-1", yfRoutineWithout2018, 4)

    val setId2018 = db.addResponsibilitySet("IC-Garske", "op-2018-1", "incomplete")
    val responsibilityId2018 = db.addResponsibility(setId2018, yfRoutine2018)
    val secondResponsibilityId2018 = db.addResponsibility(setId2018, yfCampaign2018)

    db.addExpectations(responsibilityId2018, countries = db.fetchCountries(2), outcomes = db.fetchOutcomes(2),
            cohortMinInclusive = 1980, cohortMaxInclusive = null)
    db.addExpectations(secondResponsibilityId2018, countries = db.fetchCountries(96), outcomes = db.fetchOutcomes(1))

}
