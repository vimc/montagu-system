package org.vaccineimpact.api.blackboxTests

import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class CoverageTests : DatabaseTest()
{
    val groupId = "group-1"
    val touchstoneId = "touchstone-1"
    val scenarioId = "scenario-1"
    val coverageSetId = 1
    val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/coverage/"

    @Test
    fun `can get coverage data for responsibility`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedCoverageData")
        val test = validate(url) against (schema) given {
            addCoverageData(it, touchstoneStatus = "open")
        }
        test.run()
    }

    private fun addCoverageData(db: JooqContext, touchstoneStatus: String)
    {
        db.addGroup(groupId, "description")
        db.addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        db.addTouchstone("touchstone", 1, "description", touchstoneStatus, 1900..2000, addName = true, addStatus = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "submitted", addStatus = true)
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                addVaccine = true, addActivityType = true, addSupportLevel = true)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId, 0)
        db.generateCoverageData(coverageSetId, countryCount = 2, yearRange = 1995..2000, ageRange = 0..20 step 5)
    }
}