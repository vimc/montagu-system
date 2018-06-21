package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetScenariosTests : TouchstoneRepositoryTests()
{
    @Test
    fun `no scenarios are returned if touchstone is empty()`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThat(getScenarios(it)).isEmpty()
        }
    }

    @Test
    fun `can fetch scenarios in touchstone`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarios(touchstoneVersionId, "yf-1", "ms-1")
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneVersionId)),
                            emptyList()
                    ),
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneVersionId)),
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
            val yf = it.addScenarioToTouchstone(touchstoneVersionId, "yf-1")
            val measles = it.addScenarioToTouchstone(touchstoneVersionId, "ms-1")
            yfSet1 = it.addCoverageSet(touchstoneVersionId, "YF, No vacc", "YF", "none", "none")
            yfSet2 = it.addCoverageSet(touchstoneVersionId, "YF, Routine vacc", "YF", "without", "routine")
            yfSet3 = it.addCoverageSet(touchstoneVersionId, "YF, Routine GAVI vacc", "YF", "with", "routine")
            measlesSet = it.addCoverageSet(touchstoneVersionId, "Measles, No vacc", "Measles", "none", "none")
            // We add them out of order, to check the ordering
            it.addCoverageSetToScenario(yf, yfSet2, 0)
            it.addCoverageSetToScenario(yf, yfSet3, 2)
            it.addCoverageSetToScenario(yf, yfSet1, 1)
            it.addCoverageSetToScenario(measles, measlesSet, 0)
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneVersionId)),
                            listOf(
                                    CoverageSet(measlesSet, touchstoneVersionId, "Measles, No vacc", "Measles", GAVISupportLevel.NONE, ActivityType.NONE)
                            )
                    ),
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneVersionId)),
                            listOf(
                                    CoverageSet(yfSet1, touchstoneVersionId, "YF, No vacc", "YF", GAVISupportLevel.NONE, ActivityType.NONE),
                                    CoverageSet(yfSet2, touchstoneVersionId, "YF, Routine vacc", "YF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE),
                                    CoverageSet(yfSet3, touchstoneVersionId, "YF, Routine GAVI vacc", "YF", GAVISupportLevel.WITH, ActivityType.ROUTINE)
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
            it.addTouchstoneVersion(touchstoneName, 2)
            val goodScenario = it.addScenarioToTouchstone(touchstoneVersionId, "yf-1")
            val sameScenarioWrongTouchstone = it.addScenarioToTouchstone(otherTouchstone, "yf-1")
            val otherScenario = it.addScenarioToTouchstone(otherTouchstone, "ms-1")
            goodSet = it.addCoverageSet(touchstoneVersionId, "YF, No vacc", "YF", "none", "none")
            val badSet = it.addCoverageSet(otherTouchstone, "YF, Routine vacc", "YF", "without", "routine")
            it.addCoverageSetToScenario(goodScenario, goodSet, 0)
            it.addCoverageSetToScenario(sameScenarioWrongTouchstone, badSet, 0)
            it.addCoverageSetToScenario(otherScenario, badSet, 0)
        } check {
            checkResult(getScenarios(it), listOf(
                    ScenarioAndCoverageSets(
                            Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneVersionId, otherTouchstone)),
                            listOf(
                                    CoverageSet(goodSet, touchstoneVersionId, "YF, No vacc", "YF", GAVISupportLevel.NONE, ActivityType.NONE)
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
            it.addScenarios(touchstoneVersionId, "yf-1", "yf-2", "ms-1", "ms-2")
        } check {
            Assertions.assertThat(getScenarios(it, filter())).hasSize(4)
            checkResultAssumingNoCoverageSets(getScenarios(it, filter(scenarioId = "yf-1")), listOf(
                    Scenario("yf-1", "Yellow Fever 1", "YF", listOf(touchstoneVersionId))
            ))
            checkResultAssumingNoCoverageSets(getScenarios(it, filter(disease = "Measles")), listOf(
                    Scenario("ms-1", "Measles 1", "Measles", listOf(touchstoneVersionId)),
                    Scenario("ms-2", "Measles 2", "Measles", listOf(touchstoneVersionId))
            ))
            Assertions.assertThat(getScenarios(it, filter(scenarioId = "yf-1", disease = "Measles"))).isEmpty()
        }
    }

    private fun filter(scenarioId: String? = null, disease: String? = null)
            = ScenarioFilterParameters(scenarioId, disease)

    private fun getScenarios(it: TouchstoneRepository,
                             filterParameters: ScenarioFilterParameters = ScenarioFilterParameters())
            : List<ScenarioAndCoverageSets>
    {
        return it.scenarios(touchstoneVersionId, filterParameters)
    }

    private fun checkResult(actuals: List<ScenarioAndCoverageSets?>, expecteds: List<ScenarioAndCoverageSets?>)
    {
        val paddedActuals = actuals + listOfNulls(expecteds.size - actuals.size)
        val paddedExpecteds = expecteds + listOfNulls(actuals.size - expecteds.size)
        for ((expected, actual) in paddedExpecteds.zip(paddedActuals))
        {
            if (expected == null)
            {
                Assertions.fail("Unexpected element: " + actual)
            }
            else if (actual == null)
            {
                Assertions.fail("Missing expected element: " + expected)
            }
            else
            {
                Assertions.assertThat(actual.scenario).isEqualTo(expected.scenario)
                Assertions.assertThat(actual.coverageSets).hasSameElementsAs(expected.coverageSets)
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