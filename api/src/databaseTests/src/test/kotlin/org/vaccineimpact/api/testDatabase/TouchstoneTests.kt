package org.vaccineimpact.api.testDatabase

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.CoverageSet
import org.vaccineimpact.api.models.Scenario
import org.vaccineimpact.api.models.ScenarioAndCoverageSets

class TouchstoneTests : RepositoryTests<TouchstoneRepository>()
{
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneId = "$touchstoneName-$touchstoneVersion"

    override fun makeRepository(): TouchstoneRepository
    {
        val scenarioRepository = { JooqScenarioRepository() }
        return JooqTouchstoneRepository(scenarioRepository)
    }

    @Test
    fun `no scenarios are returned if touchstone is empty()`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            assertThat(getScenarios(it)).isEmpty()
        }
    }

    @Test
    fun `can fetch scenarios in touchstone`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarios(touchstoneId, "yf-1", "ms-1")
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId)),
                            emptyList()
                    ),
                    ScenarioAndCoverageSets(
                            Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneId)),
                            emptyList()
                    )
            ))
        }
    }

    @Test
    fun `can fetch scenarios with ordered coverage sets`()
    {
        var yfSet1 = 0;
        var yfSet2 = 0;
        var yfSet3 = 0
        var measlesSet = 0
        given {
            createTouchstoneAndScenarioDescriptions(it)
            val yf = it.addScenario(touchstoneId, "yf-1")
            val measles = it.addScenario(touchstoneId, "ms-1")
            yfSet1 = it.addCoverageSet(touchstoneId, "YF, No vacc", "YF", "none", "none")
            yfSet2 = it.addCoverageSet(touchstoneId, "YF, Routine vacc", "YF", "without", "routine")
            yfSet3 = it.addCoverageSet(touchstoneId, "YF, Routine GAVI vacc", "YF", "with", "routine")
            measlesSet = it.addCoverageSet(touchstoneId, "Measles, No vacc", "Measles", "none", "none")
            // We add them out of order, to check the ordering
            it.addCoverageSetToScenario(yf, yfSet2, 0)
            it.addCoverageSetToScenario(yf, yfSet3, 2)
            it.addCoverageSetToScenario(yf, yfSet1, 1)
            it.addCoverageSetToScenario(measles, measlesSet, 0)
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId)),
                            listOf(
                                    CoverageSet(yfSet1, touchstoneId, "YF, No vacc", "YF", "none", "none"),
                                    CoverageSet(yfSet2, touchstoneId, "YF, Routine vacc", "YF", "without", "routine"),
                                    CoverageSet(yfSet3, touchstoneId, "YF, Routine GAVI vacc", "YF", "with", "routine")
                            )
                    ),
                    ScenarioAndCoverageSets(
                            Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneId)),
                            listOf(
                                    CoverageSet(measlesSet, touchstoneId, "Measles, No vacc", "Measles", "none", "none")
                            )
                    )
            ))
        }
    }

    @Test
    fun `scenarios from other touchstones are not returned`()
    {
        val otherTouchstone = "touchstone-2"
        var goodSet = 0
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addTouchstone(touchstoneName, 2)
            val goodScenario = it.addScenario(touchstoneId, "yf-1")
            val sameScenarioWrongTouchstone = it.addScenario(otherTouchstone, "yf-1")
            val otherScenario = it.addScenario(otherTouchstone, "ms-1")
            goodSet = it.addCoverageSet(touchstoneId, "YF, No vacc", "YF", "none", "none")
            val badSet = it.addCoverageSet(otherTouchstone, "YF, Routine vacc", "YF", "without", "routine")
            it.addCoverageSetToScenario(goodScenario, goodSet, 0)
            it.addCoverageSetToScenario(sameScenarioWrongTouchstone, badSet, 0)
            it.addCoverageSetToScenario(otherScenario, badSet, 0)
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId, otherTouchstone)),
                            listOf(
                                    CoverageSet(goodSet, touchstoneId, "YF, No vacc", "YF", "none", "none")
                            )
                    )
            ))
        }
    }

    @Test
    fun `can filter by scenario`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarios(touchstoneId, "yf-1", "yf-2", "ms-1", "ms-2")
        } check {
            assertThat(getScenarios(it, filter())).hasSize(4)
            checkResultAssumingNoCoverageSets(getScenarios(it, filter(scenarioId = "yf-1")), listOf(
                    Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId))
            ))
            checkResultAssumingNoCoverageSets(getScenarios(it, filter(disease = "Measles")), listOf(
                    Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneId)),
                    Scenario("ms-2", "Measles 2", "Measles", listOf(touchstoneId))
            ))
            assertThat(getScenarios(it, filter(scenarioId = "yf-1", disease = "Measles"))).isEmpty()
        }
    }

    private fun filter(scenarioId: String? = null, disease: String? = null)
            = ScenarioFilterParameters(scenarioId, disease)

    private fun getScenarios(it: TouchstoneRepository,
                             filterParameters: ScenarioFilterParameters = ScenarioFilterParameters())
            : List<ScenarioAndCoverageSets>
    {
        return it.scenarios(touchstoneId, filterParameters)
    }

    private fun createTouchstoneAndScenarioDescriptions(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDisease("YF", "Yellow Fever")
        it.addDisease("Measles", "Measles")
        it.addScenarioDescription("yf-1", "Yellow Fever 1", "YF")
        it.addScenarioDescription("yf-2", "Yellow Fever 2", "YF")
        it.addScenarioDescription("ms-1", "Measles 1", "Measles")
        it.addScenarioDescription("ms-2", "Measles 2", "Measles")

        it.addSupportLevels("none", "without", "with")
        it.addActivityTypes("none", "routine", "campaign")
        it.addVaccine("YF", "Yellow Fever")
        it.addVaccine("Measles", "Measles")
    }

    private fun checkResult(actuals: List<ScenarioAndCoverageSets?>, expecteds: List<ScenarioAndCoverageSets?>)
    {
        val paddedActuals = actuals + listOfNulls(expecteds.size - actuals.size)
        val paddedExpecteds = expecteds + listOfNulls(actuals.size - expecteds.size)
        for ((expected, actual) in paddedExpecteds.zip(paddedActuals))
        {
            if (expected == null)
            {
                fail("Unexpected element: " + actual)
            }
            else if (actual == null)
            {
                fail("Missing expected element: " + expected)
            }
            else
            {
                assertThat(actual.scenario).isEqualTo(expected.scenario)
                assertThat(actual.coverageSets).hasSameElementsAs(expected.coverageSets)
            }
        }
    }

    private fun checkResultAssumingNoCoverageSets(actuals: List<ScenarioAndCoverageSets>, expecteds: List<Scenario>)
    {
        checkResult(actuals, expecteds.map { ScenarioAndCoverageSets(it, emptyList()) })
    }

    private fun <T> listOfNulls(size: Int): List<T?>
    {
        if (size > 0)
        {
            return (0..size).map { null }
        }
        else
        {
            return emptyList()
        }
    }
}