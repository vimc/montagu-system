package org.vaccineimpact.api.blackboxTests.tests.Coverage

import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.permissions.PermissionSet
import java.math.BigDecimal
import java.io.StringReader

class TouchstoneCoverageTests : CoverageTests()
{
    val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "*/coverage.read")
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
        val testTarget = 1000.toDecimal()
        val testCoverage = 0.9.toDecimal()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, uniformData=true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "age_first", 8: "age_last", 9: "age_range_verbatim",
        //10: "gender", 11: "coverage_$testYear",
        //12: "coverage_1985", 13: "coverage_1990", 14: "coverage_1995", 15: "coverage_2000",
        //16: "target_$testYear", 17: "target_1985", 18: "target_1990", 19: "target_1995", 20: "target_2000"

        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1000"
        val expectedAggregatedCoverage = "0.9"

        //test all target values
        Assertions.assertThat(firstRow[16]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[17]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[18]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[19]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[20]).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(firstRow[11]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[12]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[13]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[14]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[15]).isEqualTo(expectedAggregatedCoverage)


    }

    @Test
    fun `wide coverage data for scenario with subnational rows have expected target and coverage values`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = BigDecimal(1000)
        val testCoverage = 0.9.toDecimal()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, includeSubnationalCoverage = true,
                    uniformData = true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        Assertions.assertThat(csv.count()).isEqualTo(11)

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "age_first", 8: "age_last", 9: "age_range_verbatim",
        //10: "gender", 11: "coverage_$testYear",
        //11: "coverage_1985", 12: "coverage_1990", 13: "coverage_1995", 14: "coverage_2000",
        //15: "target_$testYear", 16: "target_1985", 17: "target_1990", 18: "target_1995", 19: "target_2000"

        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1500"
        val expectedAggregatedCoverage = "0.7"

        //test all target values
        Assertions.assertThat(firstRow[16]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[17]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[18]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[19]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[20]).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(firstRow[11]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[12]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[13]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[14]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(firstRow[15]).isEqualTo(expectedAggregatedCoverage)


    }

    @Test
    fun `wide coverage data for scenario with subnational rows with different age_range_verbatim keeps rows separate`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = BigDecimal(1000)
        val testCoverage = 0.9.toDecimal()

        val age_range_1 = "age_range_1"
        val age_range_2 = "age_range_2"

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                        target = testTarget, coverage = testCoverage, includeSubnationalCoverage=false, uniformData=true,
                        ageRangeVerbatim = age_range_1)
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                        target = testTarget, coverage = testCoverage, includeSubnationalCoverage=false, uniformData=true,
                        ageRangeVerbatim = age_range_2, useExistingCoverageSetId = true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        Assertions.assertThat(csv.count()).isEqualTo(21)

        csv.sortBy{ it[9] } //Row order for wide format is not defined - sort by age_range_verbatim

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "age_first", 8: "age_last", 9: "age_range_verbatim",
        //10: "gender", 11: "coverage_$testYear",
        //11: "coverage_1985", 12: "coverage_1990", 13: "coverage_1995", 14: "coverage_2000",
        //15: "target_$testYear", 16: "target_1985", 17: "target_1990", 18: "target_1995", 19: "target_2000"

        val range1Row = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1000"
        val expectedAggregatedCoverage = "0.9"

        Assertions.assertThat(range1Row[9]).isEqualTo(age_range_1)

        //test all target values
        Assertions.assertThat(range1Row[16]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range1Row[17]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range1Row[18]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range1Row[19]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range1Row[20]).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(range1Row[11]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range1Row[12]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range1Row[13]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range1Row[14]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range1Row[15]).isEqualTo(expectedAggregatedCoverage)

        val range2Row = csv.drop(11).first().toList()
        Assertions.assertThat(range2Row[9]).isEqualTo(age_range_2)

        //test all target values
        Assertions.assertThat(range2Row[16]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range2Row[17]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range2Row[18]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range2Row[19]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(range2Row[20]).isEqualTo(expectedAggregatedTarget)

        //test all coverage values
        Assertions.assertThat(range2Row[11]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range2Row[12]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range2Row[13]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range2Row[14]).isEqualTo(expectedAggregatedCoverage)
        Assertions.assertThat(range2Row[15]).isEqualTo(expectedAggregatedCoverage)
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
    fun `can get pure CSV coverage data via csv endpoint with Accept * header`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("${url}csv", minimumPermissions, acceptsContentType = "*/*")
        schema.validate(response.text)
    }

    @Test
    fun `can get pure CSV coverage data via csv endpoint with Accept csv header`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("${url}csv", minimumPermissions, acceptsContentType = "text/csv")
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
        val testTarget = "1000".toBigDecimalOrNull()!!
        val testCoverage = "0.9".toBigDecimalOrNull()!!

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
        val expectedAggregatedTarget = "1500"
        val expectedAggregatedCoverage = "0.7"

        Assertions.assertThat(firstRow[11]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[12]).isEqualTo(expectedAggregatedCoverage)
    }

    @Test
    fun `coverage data for scenario with subnational rows with different age_range_verbatim keeps rows separate`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = "1000".toBigDecimalOrNull()!!
        val testCoverage = "0.9".toBigDecimalOrNull()!!

        val age_range_1 = "age_range_1"
        val age_range_2 = "age_range_2"

        //Generate identical coverage data row sets which differ only in age_range_verbatim
        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, includeSubnationalCoverage=false,
                    ageRangeVerbatim = age_range_1)
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage, includeSubnationalCoverage=false,
                    ageRangeVerbatim = age_range_2, useExistingCoverageSetId = true)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, minimumPermissions, acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        Assertions.assertThat(csv.count()).isEqualTo(101)

        //Headers:
        //0: "scenario", 1: "set_name", 2: "vaccine", 3: "gavi_support", 4: "activity_type",
        //5: "country_code", 6: "country", 7: "year" 8: "age_first", 9: "age_last", 10: "age_range_verbatim",
        //11: "target", 12: "coverage"
        val firstRow = csv.drop(1).first().toList()
        val expectedAggregatedTarget = "1000"
        val expectedAggregatedCoverage = "0.9"

        Assertions.assertThat(firstRow[10]).isEqualTo(age_range_1) //The first age_range_verbatim
        Assertions.assertThat(firstRow[11]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(firstRow[12]).isEqualTo(expectedAggregatedCoverage)

        val secondRow = csv.drop(2).first().toList()
        Assertions.assertThat(secondRow[10]).isEqualTo(age_range_2) //The second age_range_verbatim
        Assertions.assertThat(secondRow[11]).isEqualTo(expectedAggregatedTarget)
        Assertions.assertThat(secondRow[12]).isEqualTo(expectedAggregatedCoverage)
    }

}