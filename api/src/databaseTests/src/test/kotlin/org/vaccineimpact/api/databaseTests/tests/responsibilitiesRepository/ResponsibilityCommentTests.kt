package org.vaccineimpact.api.databaseTests.tests.responsibilitiesRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilityComment
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithComments
import org.vaccineimpact.api.models.responsibilities.ResponsibilityWithComment
import java.sql.Timestamp
import java.time.Instant

class ResponsibilityCommentTests : ResponsibilitiesRepositoryTests()
{

    @Test
    fun `can add responsibility comment`()
    {
        val now = Instant.now()
        var responsibilityId: Int
        given {
            responsibilityId = setupResponsibility(it)
            it.addResponsibilityComment(responsibilityId, "comment 0", "test.user", now.minusSeconds(1))
        } makeTheseChanges {
            it.addResponsibilityCommentForTouchstone("touchstone-1", "group-1", "scenario-1", "comment 1", "test.user", now)
        } andCheckDatabase {
            val result = it.dsl.selectFrom(Tables.RESPONSIBILITY_COMMENT).fetch()
            Assertions.assertThat(result.size).isEqualTo(2)
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_COMMENT.COMMENT]).isEqualTo("comment 1")
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_COMMENT.ADDED_BY]).isEqualTo("test.user")
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_COMMENT.ADDED_ON]).isEqualTo(Timestamp.from(now))
        }
    }

    @Test
    fun `can get responsibilities with comments`()
    {
        val now = Instant.now()
        given {
            val responsibilityId = setupResponsibility(it)
            it.addResponsibilityComment(responsibilityId, "comment 1", "test.user", now.minusSeconds(1))
            it.addResponsibilityComment(responsibilityId, "comment 2", "test.user", now)
            it.addResponsibilityComment(responsibilityId, "comment 3", "test.user", now.minusSeconds(2))
        } check { repo ->
            val responsibilities = repo.getResponsibilitiesWithCommentsForTouchstone("touchstone-1")
            Assertions.assertThat(responsibilities).hasSameElementsAs(
                    listOf(
                            ResponsibilitySetWithComments(
                                    "touchstone-1",
                                    "group-1",
                                    listOf(
                                            ResponsibilityWithComment(
                                                    "scenario-1",
                                                    ResponsibilityComment("comment 2", "test.user", now)
                                            )
                                    )
                            )
                    )
            )
        }
    }

    @Test
    fun `can get responsibilities without comments`()
    {
        given {
            setupResponsibility(it)
        } check { repo ->
            val responsibilities = repo.getResponsibilitiesWithCommentsForTouchstone("touchstone-1")
            Assertions.assertThat(responsibilities).hasSameElementsAs(
                    listOf(
                            ResponsibilitySetWithComments(
                                    "touchstone-1",
                                    "group-1",
                                    listOf(
                                            ResponsibilityWithComment(
                                                    "scenario-1",
                                                    null
                                            )
                                    )
                            )
                    )
            )
        }
    }

    private fun setupResponsibility(db: JooqContext): Int {
        db.addUserForTesting("test.user")
        db.addGroup("group-1")
        db.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        return db.addResponsibilityInNewSet("group-1", "touchstone-1", "scenario-1")
    }

}
