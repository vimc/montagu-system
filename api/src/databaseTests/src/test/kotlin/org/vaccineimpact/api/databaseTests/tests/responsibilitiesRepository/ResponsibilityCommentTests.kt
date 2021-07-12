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

class ResponsibilityCommentTests : ResponsibilitiesRepositoryTests() {
    private data class ReturnedIds(val responsibilitySetId: Int, val responsibilityId: Int)

    private fun setupDatabase(db: JooqContext): ReturnedIds {
        db.addUserForTesting("test.user")
        db.addGroup("group-1")
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        val responsibilitySetId = db.addResponsibilitySet("group-1", "touchstone-1")
        val responsibilityId = db.addResponsibility(responsibilitySetId, "touchstone-1", "scenario-1")
        return ReturnedIds(responsibilitySetId, responsibilityId)
    }

    @Test
    fun `can annotate responsibility`() {
        val now = Instant.now()
        given {
            val responsibilityId = setupDatabase(it).responsibilityId
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
    fun `can annotate responsibility set`() {
        val now = Instant.now()
        given {
            val responsibilitySetId = setupDatabase(it).responsibilitySetId
            it.addResponsibilitySetComment(responsibilitySetId, "comment 0", "test.user", now.minusSeconds(1))
        } makeTheseChanges {
            it.addResponsibilitySetCommentForTouchstone("touchstone-1", "group-1", "comment 1", "test.user", now)
        } andCheckDatabase {
            val result = it.dsl.selectFrom(Tables.RESPONSIBILITY_SET_COMMENT).fetch()
            Assertions.assertThat(result.size).isEqualTo(2)
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_SET_COMMENT.COMMENT]).isEqualTo("comment 1")
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_SET_COMMENT.ADDED_BY]).isEqualTo("test.user")
            Assertions.assertThat(result[1][Tables.RESPONSIBILITY_SET_COMMENT.ADDED_ON]).isEqualTo(Timestamp.from(now))
        }
    }

    @Test
    fun `can get annotated responsibility set with unannotated responsibilities`() {
        val now = Instant.now()
        given {
            val responsibilitySetId = setupDatabase(it).responsibilitySetId
            it.addResponsibilitySetComment(responsibilitySetId, "comment 1", "test.user", now.minusSeconds(1))
            it.addResponsibilitySetComment(responsibilitySetId, "comment 2", "test.user", now)
            it.addResponsibilitySetComment(responsibilitySetId, "comment 3", "test.user", now.minusSeconds(2))
        } check { repo ->
            val responsibilities = repo.getResponsibilitiesWithCommentsForTouchstone("touchstone-1")
            Assertions.assertThat(responsibilities).hasSameElementsAs(
                    listOf(
                            ResponsibilitySetWithComments(
                                    "touchstone-1",
                                    "group-1",
                                    ResponsibilityComment("comment 2", "test.user", now),
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

    @Test
    fun `can get unannotated responsibility set with unannotated responsibilities`() {
        given {
            setupDatabase(it)
        } check { repo ->
            val responsibilities = repo.getResponsibilitiesWithCommentsForTouchstone("touchstone-1")
            Assertions.assertThat(responsibilities).hasSameElementsAs(
                    listOf(
                            ResponsibilitySetWithComments(
                                    "touchstone-1",
                                    "group-1",
                                    null,
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

    @Test
    fun `can get annotated responsibility set with annotated responsibilities`() {
        val now = Instant.now()
        given {
            val (responsibilitySetId, responsibilityId) = setupDatabase(it)
            it.addResponsibilitySetComment(responsibilitySetId, "comment 1", "test.user", now.minusSeconds(1))
            it.addResponsibilitySetComment(responsibilitySetId, "comment 2", "test.user", now)
            it.addResponsibilitySetComment(responsibilitySetId, "comment 3", "test.user", now.minusSeconds(2))
            it.addResponsibilityComment(responsibilityId, "comment 4", "test.user", now.minusSeconds(1))
            it.addResponsibilityComment(responsibilityId, "comment 5", "test.user", now)
            it.addResponsibilityComment(responsibilityId, "comment 6", "test.user", now.minusSeconds(2))
        } check { repo ->
            val responsibilities = repo.getResponsibilitiesWithCommentsForTouchstone("touchstone-1")
            Assertions.assertThat(responsibilities).hasSameElementsAs(
                    listOf(
                            ResponsibilitySetWithComments(
                                    "touchstone-1",
                                    "group-1",
                                    ResponsibilityComment("comment 2", "test.user", now),
                                    listOf(
                                            ResponsibilityWithComment(
                                                    "scenario-1",
                                                    ResponsibilityComment("comment 5", "test.user", now)
                                            )
                                    )
                            )
                    )
            )
        }
    }

}
