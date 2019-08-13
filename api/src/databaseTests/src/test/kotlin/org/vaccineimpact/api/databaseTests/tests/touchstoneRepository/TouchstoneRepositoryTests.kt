package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.LongCoverageRow
import java.math.BigDecimal
import java.math.RoundingMode

abstract class TouchstoneRepositoryTests : RepositoryTests<TouchstoneRepository>()
{
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneVersionId = "$touchstoneName-$touchstoneVersion"
    val scenarioId = "yf-1"

    val setA = 1
    val setB = 2
    val setC = 3

    val groupId = "group-1"

    override fun makeRepository(db: JooqContext): TouchstoneRepository
    {
        val scenarioRepository = JooqScenarioRepository(db.dsl)
        return JooqTouchstoneRepository(db.dsl, scenarioRepository)
    }

    protected fun createTouchstoneAndScenarioDescriptions(it: JooqContext)
    {
        it.addTouchstoneVersion(touchstoneName, touchstoneVersion, addTouchstone = true)
        it.addDisease("YF", "Yellow Fever")
        it.addDisease("Measles", "Measles")
        it.addScenarioDescription(scenarioId, "Yellow Fever 1", "YF")
        it.addScenarioDescription("yf-2", "Yellow Fever 2", "YF")
        it.addScenarioDescription("ms-1", "Measles 1", "Measles")
        it.addScenarioDescription("ms-2", "Measles 2", "Measles")
        it.addVaccine("YF", "Yellow Fever")
        it.addVaccine("Measles", "Measles")
        it.addVaccine("BF", "Blue Fever")
        it.addVaccine("AF", "Alpha Fever")
    }

    protected fun addABCoverageSets(db: JooqContext)
    {
        db.addCoverageSet(touchstoneVersionId, "First", "AF", "without", "routine", id = setA)
        db.addCoverageSet(touchstoneVersionId, "Second", "BF", "without", "campaign", id = setB)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 1)
    }

    protected fun addABCountries(db: JooqContext)
    {
        db.addCountries(listOf("AAA", "BBB"))
    }

    protected fun giveUnorderedCoverageSetsAndDataToScenario(db: JooqContext, addCountries: Boolean = true)
    {
        db.addCoverageSet(touchstoneVersionId, "First", "AF", "without", "routine", id = setA)
        db.addCoverageSet(touchstoneVersionId, "Second", "BF", "without", "campaign", id = setB)
        db.addCoverageSet(touchstoneVersionId, "Third", "BF", "without", "routine", id = setC)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setC, 2)

        if (addCountries)
        {
            db.addCountries(listOf("AAA", "BBB"))
        }

        // adding these in jumbled up order
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setB, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)

    }

    protected fun giveUnorderedCoverageSetAndDataWithDuplicatesToScenario(db: JooqContext, addCountries: Boolean = true)
    {
        addABCoverageSets(db);

        if (addCountries)
        {
            addABCountries(db);
        }

        db.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal.valueOf(0.2))
        db.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), BigDecimal.valueOf(0.6))
        db.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), BigDecimal.valueOf(0.8))

        db.addCoverageRow(setA, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(400), BigDecimal.valueOf(0.1))
        db.addCoverageRow(setA, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), BigDecimal.valueOf(0.2))
        db.addCoverageRow(setA, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(600), BigDecimal.valueOf(0.3))

        db.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal.valueOf(0.123))
    }

    protected fun giveScenarioCoverageSets(db: JooqContext, scenarioId: String, includeCoverageData: Boolean)
    {
        db.addCoverageSet(touchstoneVersionId, "YF without", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneVersionId, "YF with", "YF", "with", "campaign", id = setB)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 4)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        if (includeCoverageData)
        {
            db.addCountries(listOf("AAA", "BBB"))
            db.addCoverageRow(setA, "AAA", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), 50.5.toDecimal())
            db.addCoverageRow(setB, "BBB", 2001, 11.toDecimal(), 21.toDecimal(), null, null, null)
        }
    }

    protected fun assertLongCoverageRowListEqual(actual: List<LongCoverageRow>,
                                                 expected: List<LongCoverageRow>)
    {
        //Do an 'almost exact' list comparison on expected LongCoverageRows, allowing for tolerance on floating point
        //coverage values
        Assertions.assertThat(actual.count()).isEqualTo(expected.count())
        for (i in 0 until expected.count())
        {
            val e = expected[i]
            val a = actual[i]

            Assertions.assertThat(a.scenario).isEqualTo(e.scenario)
            Assertions.assertThat(a.setName).isEqualTo(e.setName)
            Assertions.assertThat(a.vaccine).isEqualTo(e.vaccine)
            Assertions.assertThat(a.activityType).isEqualTo(e.activityType)
            Assertions.assertThat(a.countryCode).isEqualTo(e.countryCode)
            Assertions.assertThat(a.country).isEqualTo(e.country)
            Assertions.assertThat(a.year).isEqualTo(e.year)
            Assertions.assertThat(a.ageFirst).isEqualTo(e.ageFirst)
            Assertions.assertThat(a.ageLast).isEqualTo(e.ageLast)
            Assertions.assertThat(a.ageRangeVerbatim).isEqualTo(e.ageRangeVerbatim)
            Assertions.assertThat(a.target).isEqualTo(e.target)
            Assertions.assertThat(a.coverage?.setScale(10, RoundingMode.HALF_UP))
                    .isEqualTo(e.coverage?.setScale(10, RoundingMode.HALF_UP))
        }

    }
}