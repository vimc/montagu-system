package org.vaccineimpact.api.tests.logic.CoverageLogic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.RepositoriesCoverageLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.CoverageIngestionRow
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.models.GenderEnum
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal
import java.time.Instant

class SaveCoverageTests : MontaguTests()
{
    private val testSequence = sequenceOf(
            // each of these belongs to a new coverage set
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, true, 2021, 1, 10, GenderEnum.BOTH, 100F, 78.8F),
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.ROUTINE, false, 2022, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
            CoverageIngestionRow("HepB", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
            CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2026, 1, 10, GenderEnum.BOTH, 100F, 65.5F),

            // belongs to same coverage set as the first row
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, true, 2022, 1, 10, GenderEnum.BOTH, 100F, 78.8F)
    )

    private val mockExpectationsRepo = mock<ExpectationsRepository> {
        on { getExpectedGAVICoverageCountries(any()) } doReturn listOf("AFG")
    }

    private val now = Instant.now()

    @Test
    fun `new coverage sets are created as needed`()
    {
        val mockRepo = mock<TouchstoneRepository>() {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        sut.saveCoverageForTouchstone("t1", testSequence, "desc", "uploader", now, validate = false)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "desc", "uploader", now)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITH, "desc", "uploader", now)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "desc", "uploader", now)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB", ActivityType.ROUTINE, GAVISupportLevel.WITH, "desc", "uploader", now)
        verify(mockRepo, Times(5)).newCoverageRowRecord(any(), any(), any(), any(), any(), any(), any(), any(), any())
        verify(mockRepo).saveCoverageForTouchstone(any(), any())
        verify(mockRepo).getGenders()
        verifyNoMoreInteractions(mockRepo)
    }

    @Test
    fun `rows are created correctly`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
            on { createCoverageSet(any(), any(), any(), any(), any(), any(), any()) } doReturn 1
        }
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        sut.saveCoverageForTouchstone("t1", testSequence, "", "", now, validate = false)
        verify(mockRepo, Times(1)).newCoverageRowRecord(1,
                "AFG",
                2021,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                78.8.toBigDecimal())
        verify(mockRepo, Times(1)).newCoverageRowRecord(1,
                "AFG",
                2022,
                BigDecimal(1),
                BigDecimal(10),
                111,
                false,
                100F.toBigDecimal(),
                65.5.toBigDecimal())
    }

    @Test
    fun `coverage records are saved to correct coverage set`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
            on { createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 1
            on { createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITH, "", "", now) } doReturn 2
            on { createCoverageSet("t1", "HepB", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 3
            on { createCoverageSet("t1", "HepB", ActivityType.ROUTINE, GAVISupportLevel.WITH, "", "", now) } doReturn 4
        }
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        sut.saveCoverageForTouchstone("t1", testSequence, "", "", now, validate = false)
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(1), any(), eq(2021), any(), any(), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(1), any(), eq(2021), any(), any(), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(2), any(), eq(2022), any(), any(), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(3), any(), eq(2025), any(), any(), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(4), any(), eq(2026), any(), any(), any(), any(), any(), any())
    }

    @Test
    fun `validation detects missing rows for given routine diseases only`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("YF", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("Measles", "AFG", ActivityType.ROUTINE, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F))
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)

        val expectedMessage = """Missing 18 rows for vaccines HepB, Measles:
 *HepB, AFG, 2021
 *HepB, AFG, 2022
 *HepB, AFG, 2023
 *HepB, AFG, 2024
 *HepB, AFG, 2026
and 13 others"""

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(MissingRowsError::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `any number of rows fine for campaign`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        // missing rows and duplicates fine for campaign
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("YF", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("YF", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F))
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        verify(mockRepo, Times(3)).newCoverageRowRecord(any(), any(), any(), any(), any(), any(), any(), any(), any())
    }

    @Test
    fun `validation detects duplicate `()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2022, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2023, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2023, 1, 10, GenderEnum.BOTH, 100F, 65.5F))
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        val expectedMessage = "Duplicate row detected: 2023, HepB, AFG"

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `validation detects bad campaign years`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "AFG", ActivityType.CAMPAIGN, true, 2010, 1, 10, GenderEnum.BOTH, 100F, 65.5F)
        )
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        val expectedMessage = "Unexpected year: 2010"

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `validation detects bad routine years`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, true, 2010, 1, 10, GenderEnum.BOTH, 100F, 65.5F)
        )
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        val expectedMessage = "Unexpected year: 2010"

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `validation detects unexpected countries for routine data`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "123", ActivityType.ROUTINE, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F)
        )
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        val expectedMessage = "Unrecognised or unexpected country: 123"

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `validation detects unexpected countries for campaign data`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
        }
        val testSequence = sequenceOf(
                CoverageIngestionRow("HepB", "123", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F)
        )
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        val expectedMessage = "Unrecognised or unexpected country: 123"

        assertThatThrownBy {
            sut.saveCoverageForTouchstone("t1", testSequence, "", "", now)
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining(expectedMessage)
    }

    @Test
    fun `combination vaccines are mapped to vaccines correctly`()
    {
        val vaxProgSequence = sequenceOf(
                CoverageIngestionRow("Penta", "AFG", ActivityType.CAMPAIGN,  true, 2021, 1, 10, GenderEnum.BOTH, 100F, 78.8F),
                CoverageIngestionRow("pentavalent", "AFG", ActivityType.CAMPAIGN, false, 2022, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("mr1", "AFG", ActivityType.CAMPAIGN, true, 2025, 1, 10, GenderEnum.BOTH, 100F, 65.5F),
                CoverageIngestionRow("MR2", "AFG", ActivityType.ROUTINE, true, 2026, 1, 10, GenderEnum.BOTH, 100F, 65.5F)
        )

        val mockRepo = mock<TouchstoneRepository> {
            on { getGenders() } doReturn mapOf(GenderEnum.BOTH to 111)
            on { createCoverageSet("t1", "Hib3", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 1
            on { createCoverageSet("t1", "HepB", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 2
            on { createCoverageSet("t1", "DTP3", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 3
            on { createCoverageSet("t1", "MCV1", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 4
            on { createCoverageSet("t1", "Rubella", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, "", "", now) } doReturn 5
            on { createCoverageSet("t1", "MCV2", ActivityType.ROUTINE, GAVISupportLevel.WITH, "", "", now) } doReturn 6
            on { createCoverageSet("t1", "RCV2", ActivityType.ROUTINE, GAVISupportLevel.WITH, "", "", now) } doReturn 7
        }

        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock(), mockExpectationsRepo)
        sut.saveCoverageForTouchstone("t1", vaxProgSequence, "", "", now, validate = false)

        //Penta
        verify(mockRepo, Times(1)).newCoverageRowRecord(1,
                "AFG",
                2021,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                78.8.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(2,
                "AFG",
                2021,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                78.8.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(3,
                "AFG",
                2021,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                78.8.toBigDecimal())

        //pentavalent
        verify(mockRepo, Times(1)).newCoverageRowRecord(1,
                "AFG",
                2022,
                BigDecimal(1),
                BigDecimal(10),
                111,
                false,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(2,
                "AFG",
                2022,
                BigDecimal(1),
                BigDecimal(10),
                111,
                false,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(3,
                "AFG",
                2022,
                BigDecimal(1),
                BigDecimal(10),
                111,
                false,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        //mr1
        verify(mockRepo, Times(1)).newCoverageRowRecord(4,
                "AFG",
                2025,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(5,
                "AFG",
                2025,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        //MR2
        verify(mockRepo, Times(1)).newCoverageRowRecord(6,
                "AFG",
                2026,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

        verify(mockRepo, Times(1)).newCoverageRowRecord(7,
                "AFG",
                2026,
                BigDecimal(1),
                BigDecimal(10),
                111,
                true,
                100F.toBigDecimal(),
                65.5.toBigDecimal())

    }
}
