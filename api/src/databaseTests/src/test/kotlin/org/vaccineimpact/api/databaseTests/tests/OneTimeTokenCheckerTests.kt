package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.JooqOneTimeTokenChecker
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.ONETIME_TOKEN
import org.vaccineimpact.api.test_helpers.DatabaseTest

class OneTimeTokenCheckerTests : DatabaseTest()
{
    @Test
    fun `checkToken returns false if no token matches`()
    {
        val factory = RepositoryFactory()
        val checker = JooqOneTimeTokenChecker(factory)
        assertThat(checker.checkToken("TOKEN")).isFalse()
    }

    @Test
    fun `checkToken returns true and clears token if any token matches`()
    {
        JooqContext().use { db ->
            db.dsl.insertInto(ONETIME_TOKEN).values("TOKEN").execute()
        }

        val factory = RepositoryFactory()
        val checker = JooqOneTimeTokenChecker(factory)
        assertThat(checker.checkToken("TOKEN")).isTrue()

        JooqContext().use { db ->
            val records = db.dsl.selectFrom(ONETIME_TOKEN).fetch()
            assertThat(records).isEmpty()
        }

    }
}