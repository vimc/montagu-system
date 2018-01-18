package org.vaccineimpact.api.blackboxTests

import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.runner.RunWith
import org.junit.runners.Suite
import org.vaccineimpact.api.blackboxTests.tests.*
import org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates.CreateBurdenEstimateTests
import org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates.ModelRunParameterTests
import org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates.RetrieveBurdenEstimateTests
import org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates.PopulateBurdenEstimateTests
import org.vaccineimpact.api.test_helpers.DatabaseCreationHelper

// Keep these sorted alphabetically, for consistency
@RunWith(Suite::class)
@Suite.SuiteClasses(
        AccessLogTests::class,
        AuthenticationTests::class,
        CoverageTests::class,
        CreateBurdenEstimateTests::class,
        CreateUserTests::class,
        DemographicTests::class,
        DiseaseTests::class,
        GeneralBlackboxTests::class,
        IndexTests::class,
        ModellingGroupTests::class,
        ModelRunParameterTests::class,
        ModelTests::class,
        PasswordTests::class,
        PopulateBurdenEstimateTests::class,
        ResponsibilityTests::class,
        RetrieveBurdenEstimateTests::class,
        ScenarioTests::class,
        TouchstoneTests::class,
        UserTests::class
)
class BlackboxTestsSuite
{
    companion object
    {
        @BeforeClass
        @JvmStatic
        fun createTemplateDatabase()
        {
            DatabaseCreationHelper.createTemplateFromDatabase()
        }

        @AfterClass
        @JvmStatic
        fun restoreDatabaseFromTemplate()
        {
            DatabaseCreationHelper.restoreDatabaseFromTemplate()
        }
    }
}