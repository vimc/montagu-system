package org.vaccineimpact.api.databaseTests

import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.runner.RunWith
import org.junit.runners.Suite
import org.vaccineimpact.api.security.tests.AddUserToGroupOptionsTests
import org.vaccineimpact.api.security.tests.AddUserToGroupTests
import org.vaccineimpact.api.security.tests.GroupsTests
import org.vaccineimpact.api.security.tests.QuestionTests
import org.vaccineimpact.api.test_helpers.DatabaseCreationHelper

// Keep these sorted alphabetically, for consistency
@RunWith(Suite::class)
@Suite.SuiteClasses(
        AddUserToGroupOptionsTests::class,
        AddUserToGroupTests::class,
        GroupsTests::class,
        QuestionTests::class
)
class UserCLITestSuite
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
