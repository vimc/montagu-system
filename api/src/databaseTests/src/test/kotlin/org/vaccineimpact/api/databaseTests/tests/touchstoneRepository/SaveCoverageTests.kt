package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy
import org.jooq.exception.DataAccessException
import org.junit.Test
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.addCoverageSet
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.db.direct.addVaccine
import org.vaccineimpact.api.db.tables.GaviSupportLevel
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.models.GenderEnum
import java.math.BigDecimal
import java.sql.Timestamp
import java.time.Instant

class SaveCoverageTests : TouchstoneRepositoryTests()
{
    @Test
    fun `can create coverage set and metadata`()
    {
        val now = Instant.now()
        withDatabase {
            it.addUserForTesting("test.user")
            it.addVaccine("v1")
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
        }
        withRepo {
            val metaId = it.createCoverageSetMetadata("desc", "test.user", now)
            it.createCoverageSet("t-1", "v1", ActivityType.ROUTINE, GAVISupportLevel.WITHOUT, metaId)
        }
        withDatabase {
            val metadata = it.dsl.selectFrom(COVERAGE_SET_UPLOAD_METADATA)
                    .fetchOne()
            assertThat(metadata[COVERAGE_SET_UPLOAD_METADATA.UPLOADED_BY]).isEqualTo("test.user")
            assertThat(metadata[COVERAGE_SET_UPLOAD_METADATA.UPLOADED_ON].toInstant()).isEqualTo(now)
            assertThat(metadata[COVERAGE_SET_UPLOAD_METADATA.DESCRIPTION]).isEqualTo("desc")

            val set = it.dsl.selectFrom(COVERAGE_SET)
                    .fetchOne()

            assertThat(set[COVERAGE_SET.COVERAGE_SET_UPLOAD_METADATA]).isEqualTo(metadata[COVERAGE_SET_UPLOAD_METADATA.ID])
            assertThat(set[COVERAGE_SET.TOUCHSTONE]).isEqualTo("t-1")
            assertThat(set[COVERAGE_SET.VACCINE]).isEqualTo("v1")
            assertThat(set[COVERAGE_SET.ACTIVITY_TYPE]).isEqualTo("routine")
            assertThat(set[COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("without")
            assertThat(set[COVERAGE_SET.NAME]).isEqualTo("v1: v1, without, routine")
        }
    }

    @Test
    fun `create coverage set will throw DataAccessException for invalid vaccines`()
    {
        withDatabase {
            it.addUserForTesting("test.user")
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
        }
        withRepo {
            val metaId = it.createCoverageSetMetadata("desc", "test.user", Instant.now())
            assertThatThrownBy {
                it.createCoverageSet("t-1", "v1", ActivityType.ROUTINE, GAVISupportLevel.WITHOUT, metaId)
            }.isInstanceOf(DataAccessException::class.java)
        }
    }

    @Test
    fun `can create coverage set for all activity types`()
    {
        withDatabase {
            it.addUserForTesting("test.user")
            it.addVaccine("v1")
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
        }
        withRepo { repo ->
            val metaId = repo.createCoverageSetMetadata("desc", "test.user", Instant.now())
            listOf(ActivityType.ROUTINE, ActivityType.CAMPAIGN, ActivityType.CAMPAIGN_REACTIVE, ActivityType.NONE)
                    .forEach {
                        repo.createCoverageSet("t-1", "v1", it, GAVISupportLevel.WITHOUT, metaId)
                    }
        }
        withDatabase {
            val set = it.dsl.selectFrom(COVERAGE_SET)
                    .fetch()
            assertThat(set[0][COVERAGE_SET.ACTIVITY_TYPE]).isEqualTo("routine")
            assertThat(set[1][COVERAGE_SET.ACTIVITY_TYPE]).isEqualTo("campaign")
            assertThat(set[2][COVERAGE_SET.ACTIVITY_TYPE]).isEqualTo("campaign-reactive")
            assertThat(set[3][COVERAGE_SET.ACTIVITY_TYPE]).isEqualTo("none")
        }
    }

    @Test
    fun `can create coverage set for all support levels`()
    {
        withDatabase {
            it.addUserForTesting("test.user")
            it.addVaccine("v1")
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
        }
        withRepo { repo ->
            val metaId = repo.createCoverageSetMetadata("desc", "test.user", Instant.now())
            listOf(GAVISupportLevel.WITH,
                    GAVISupportLevel.WITHOUT,
                    GAVISupportLevel.BESTCASE,
                    GAVISupportLevel.BESTMINUS,
                    GAVISupportLevel.GAVI_OPTIMISTIC,
                    GAVISupportLevel.CONTINUE,
                    GAVISupportLevel.HIGH,
                    GAVISupportLevel.LOW,
                    GAVISupportLevel.HOLD2010,
                    GAVISupportLevel.INTENSIFIED,
                    GAVISupportLevel.NONE,
                    GAVISupportLevel.STATUS_QUO)
                    .forEach {
                        repo.createCoverageSet("t-1", "v1", ActivityType.NONE, it, metaId)
                    }
        }
        withDatabase {
            val set = it.dsl.selectFrom(COVERAGE_SET)
                    .fetch()
            assertThat(set[0][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("with")
            assertThat(set[1][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("without")
            assertThat(set[2][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("bestcase")
            assertThat(set[3][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("bestminus")
            assertThat(set[4][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("gavi_optimistic")
            assertThat(set[5][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("continue")
            assertThat(set[6][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("high")
            assertThat(set[7][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("low")
            assertThat(set[8][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("hold2010")
            assertThat(set[9][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("intensified")
            assertThat(set[10][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("none")
            assertThat(set[11][COVERAGE_SET.GAVI_SUPPORT_LEVEL]).isEqualTo("status_quo")
        }
    }

    @Test
    fun `can create new coverage row record`()
    {
        val result = withRepo {
            it.newCoverageRowRecord(1,
                    "AFG",
                    2020,
                    BigDecimal(0),
                    BigDecimal(5),
                    1,
                    true,
                    BigDecimal(100),
                    BigDecimal(200),
                    true)
        }

        assertThat(result.coverageSet).isEqualTo(1)
        assertThat(result.country).isEqualTo("AFG")
        assertThat(result.year).isEqualTo(2020)
        assertThat(result.ageFrom.toInt()).isEqualTo(0)
        assertThat(result.ageTo.toInt()).isEqualTo(5)
        assertThat(result.target).isEqualTo(BigDecimal(100))
        assertThat(result.coverage).isEqualTo(BigDecimal(200))
        assertThat(result.gender).isEqualTo(1)
        assertThat(result.gaviSupport).isEqualTo(true)
        assertThat(result.subnational).isEqualTo(true)
    }

    @Test
    fun `can persist coverage rows to db`()
    {
        withDatabase {
            it.addVaccine("v1")
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
            it.addCoverageSet("t-1", "name", "v1", "with", "routine", 11)
        }
        withRepo {
            val row = it.newCoverageRowRecord(11,
                    "AFG",
                    2020,
                    BigDecimal(0),
                    BigDecimal(5),
                    1,
                    true,
                    BigDecimal(100),
                    BigDecimal(200),
                    true)
            it.saveCoverageForTouchstone("t1", listOf(row))
        }
        val result = withDatabase {
            it.dsl.selectFrom(COVERAGE)
                    .fetchOne()
        }
        assertThat(result[COVERAGE.COVERAGE_SET]).isEqualTo(11)
        assertThat(result[COVERAGE.COUNTRY]).isEqualTo("AFG")
        assertThat(result[COVERAGE.YEAR]).isEqualTo(2020)
        assertThat(result[COVERAGE.AGE_FROM].toInt()).isEqualTo(0)
        assertThat(result[COVERAGE.AGE_TO].toInt()).isEqualTo(5)
        assertThat(result[COVERAGE.TARGET]).isEqualTo(BigDecimal(100))
        assertThat(result[COVERAGE.COVERAGE_]).isEqualTo(BigDecimal(200))
        assertThat(result[COVERAGE.GENDER]).isEqualTo(1)
        assertThat(result[COVERAGE.GAVI_SUPPORT]).isEqualTo(true)
        assertThat(result[COVERAGE.SUBNATIONAL]).isEqualTo(true)
    }

    @Test
    fun `can get genders`()
    {
        val genders = withRepo {
            it.getGenders()
        }
        assertThat(genders[GenderEnum.BOTH]).isEqualTo(1)
        assertThat(genders[GenderEnum.MALE]).isEqualTo(2)
        assertThat(genders[GenderEnum.FEMALE]).isEqualTo(3)
    }

    @Test
    fun `can get latest coverage upload metadata ordered by vaccine name`()
    {
        val then = Instant.now()
        val now = Instant.now()
        withDatabase {
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
            it.addUserForTesting("test.user")
            it.addVaccine("a")
            it.addVaccine("b")
        }
        val meta = withRepo {
            val oldMetaId = it.createCoverageSetMetadata("desc", "test.user", then)
            val recentMetaId = it.createCoverageSetMetadata("desc", "test.user", now)
            it.createCoverageSet("t-1", "b", ActivityType.ROUTINE, GAVISupportLevel.WITH, oldMetaId)
            it.createCoverageSet("t-1", "a", ActivityType.ROUTINE, GAVISupportLevel.WITH, oldMetaId)
            it.createCoverageSet("t-1", "a", ActivityType.ROUTINE, GAVISupportLevel.WITH, recentMetaId)
            it.getCoverageUploadMetadata("t-1")
        }

        assertThat(meta.count()).isEqualTo(2)
        assertThat(meta[0].vaccine).isEqualTo("a")
        assertThat(meta[0].uploadedOn).isEqualTo(now)
        assertThat(meta[0].uploadedBy).isEqualTo("test.user")

        assertThat(meta[1].vaccine).isEqualTo("b")
        assertThat(meta[1].uploadedOn).isEqualTo(then)
        assertThat(meta[1].uploadedBy).isEqualTo("test.user")
    }

    @Test
    fun `can get empty coverage upload metadata`()
    {
        withDatabase {
            it.addTouchstoneVersion("t", 1, addTouchstone = true)
            it.addUserForTesting("test.user")
            it.addVaccine("v1")
            // not all coverage sets will be uploaded through the portal, some
            // are created by the science team via data imports so will not have
            // upload metadata
            it.addCoverageSet("t-1", "name", "v1", "with", "campaign")
        }
        val meta = withRepo { it.getCoverageUploadMetadata("t-1") }
        assertThat(meta.count()).isEqualTo(0)
    }
}
