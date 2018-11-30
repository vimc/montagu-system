package org.vaccineimpact.api.blackboxTests.tests.Coverage

import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.toDecimalOrNull
import org.vaccineimpact.api.models.permissions.PermissionSet
import java.math.BigDecimal
import java.io.StringReader

class TouchstoneCoverageTests : CoverageTests()
{
    val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "*/responsibilities.read", "*/coverage.read")
    val url = "/touchstones/$touchstoneVersionId/$scenarioId/coverage/"

    @Test
    fun `can get coverage data for scenario`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedCoverageData")
        val test = validate(url) against (schema) given {
            addCoverageData(it, touchstoneStatus = "open")
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `can get coverage data for scenario with subnational rows`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedCoverageData")
        val test = validate(url) against (schema) given {
            //add duplicate rows for each combination of dimension values - output data should be grouped & aggregated
            addCoverageData(it, touchstoneStatus = "open", includeSubnationalCoverage=true)
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `can get streamed data without gzip`()
    {
        val userHelper = TestUserHelper()
        JooqContext().use {
            userHelper.setupTestUser(it)
            addCoverageData(it, touchstoneStatus = "open")
        }

        val response = RequestHelper().getWithoutGzip(url, minimumPermissions)
        SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedCoverageData")
                .validateResponse(response.text, response.headers["Content-Type"])

        Assertions.assertThat(response.headers["Content-Encoding"]).isNull()
    }

    @Test
    fun `can get wide coverage data for scenario`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedWideCoverageData")
        val test = validate("$url?format=wide") against (schema) given {
            addCoverageData(it, touchstoneStatus = "open")
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `can get wide coverage data for scenario with subnational rows`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedWideCoverageData")
        val test = validate("$url?format=wide") against (schema) given {
            //add duplicate rows for each combination of dimension values - output data should be grouped & aggregated
            addCoverageData(it, touchstoneStatus = "open", includeSubnationalCoverage=true)
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `wide coverage data for scenario rows have expected target and coverage values`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = BigDecimal(1000)
        val testCoverage = "0.9".toDecimalOrNull()!!

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        val headers = csv.first().toList()
        val expectedHeaders = listOf("scenario", "set_name", "vaccine", "gavi_support", "activity_type",
                "country_code", "country", "age_first", "age_last", "age_range_verbatim", "coverage_$testYear",
                "coverage_1985", "coverage_1990", "coverage_1995", "coverage_2000",
                "target_$testYear",
                "target_1985", "target_1990", "target_1995", "target_2000")
        headers.forEachIndexed { index, h ->
            Assertions.assertThat(h).isEqualTo(expectedHeaders[index])
        }

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "age_first", 8: "age_last", 9: "age_range_verbatim", 10: "coverage_$testYear",
        //11: "coverage_1985", 12: "coverage_1990", 13: "coverage_1995", 14: "coverage_2000",
        //15: "target_$testYear", 16: "target_1985", 17: "target_1990", 18: "target_1995", 19: "target_2000"

        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1000.00".toBigDecimalOrNull()
        val expectedAggregatedCoverage = "0.90".toBigDecimalOrNull()

        //test all target values
        Assertions.assertThat(firstRow[15].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[16].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[17].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[18].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[19].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(firstRow[10].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[11].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[12].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[13].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[14].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)


    }

    @Test
    fun `wide coverage data for scenario with subnational rows have expected target and coverage values`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = BigDecimal(1000)
        val testCoverage = "0.9".toDecimalOrNull()!!

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, includeSubnationalCoverage=true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        val headers = csv.first().toList()
        val expectedHeaders = listOf("scenario", "set_name", "vaccine", "gavi_support", "activity_type",
                "country_code", "country", "age_first", "age_last", "age_range_verbatim", "coverage_$testYear",
                "coverage_1985", "coverage_1990", "coverage_1995", "coverage_2000",
                "target_$testYear",
                "target_1985", "target_1990", "target_1995", "target_2000")
        headers.forEachIndexed { index, h ->
            Assertions.assertThat(h).isEqualTo(expectedHeaders[index])
        }

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "age_first", 8: "age_last", 9: "age_range_verbatim", 10: "coverage_$testYear",
        //11: "coverage_1985", 12: "coverage_1990", 13: "coverage_1995", 14: "coverage_2000",
        //15: "target_$testYear", 16: "target_1985", 17: "target_1990", 18: "target_1995", 19: "target_2000"

        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1500.00".toBigDecimalOrNull()
        val expectedAggregatedCoverage = "0.70".toBigDecimalOrNull()

        //test all target values
        Assertions.assertThat(firstRow[15].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[16].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[17].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[18].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[19].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(firstRow[10].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[11].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[12].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[13].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[14].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)


    }

    @Test
    fun `can get pure CSV coverage data for scenario`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, minimumPermissions, acceptsContentType = "text/csv")
        schema.validate(response.text)
    }

    @Test
    fun `can get pure CSV coverage data via csv endpoint`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("${url}csv", minimumPermissions)
        schema.validate(response.text)
    }

    @Test
    fun `only touchstone preparer can get coverage data for in-preparation responsibility`()
    {
        val permission = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permission, SplitValidator())
        checker.checkPermissionIsRequired(permission,
                given = { addCoverageData(it, touchstoneStatus = "in-preparation") },
                expectedProblem = ExpectedProblem("unknown-touchstone-version", touchstoneVersionId))
    }

    @Test
    fun `coverage data for scenario with subnational rows have expected target and coverage values`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = "1000".toDecimalOrNull()!!
        val testCoverage = "0.9".toDecimalOrNull()!!

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, includeSubnationalCoverage=true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "year" 8: "age_first", 9: "age_last", 10: "age_range_verbatim",
        //11: "target", 12: "coverage"
        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1500.00".toBigDecimalOrNull()
        val expectedAggregatedCoverage = "0.70".toBigDecimalOrNull()

        Assertions.assertThat(firstRow[11].toBigDecimalOrNull()).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[12].toBigDecimalOrNull()).isEqualTo(expectedAggregatedCoverage)
    }

}