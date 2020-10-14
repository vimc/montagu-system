package org.vaccineimpact.api.tests.logic.CoverageLogic

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.logic.RepositoriesCoverageLogic
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.CoverageIngestionRow
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.math.BigDecimal

class SaveCoverageTests : MontaguTests()
{
    private val testSequence = sequenceOf(
            // each of these belongs to a new coverage set
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, 2020, 1, 10, 100F, 78.8F),
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.ROUTINE, GAVISupportLevel.WITH, 2022, 1, 10, 100F, 65.5F),
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITHOUT, 2023, 1, 10, 100F, 65.5F),
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.ROUTINE, GAVISupportLevel.WITHOUT, 2024, 1, 10, 100F, 65.5F),
            CoverageIngestionRow("HepB", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, 2025, 1, 10, 100F, 65.5F),
            CoverageIngestionRow("HepB", "AFG", ActivityType.ROUTINE, GAVISupportLevel.WITH, 2025, 1, 10, 100F, 65.5F),

            // belongs to same coverage set as the first row
            CoverageIngestionRow("HepB_BD", "AFG", ActivityType.CAMPAIGN, GAVISupportLevel.WITH, 2021, 1, 10, 100F, 78.8F)
    )

    @Test
    fun `new coverage sets are created as needed`()
    {
        val mockRepo = mock<TouchstoneRepository>()
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock())
        sut.saveCoverageForTouchstone("t1", testSequence)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITH)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITH)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITHOUT)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITHOUT)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB", ActivityType.CAMPAIGN, GAVISupportLevel.WITH)
        verify(mockRepo, Times(1)).createCoverageSet("t1", "HepB", ActivityType.ROUTINE, GAVISupportLevel.WITH)
        verify(mockRepo, Times(7)).newCoverageRowRecord(any(), any(), any(), any(), any(), any(), any())
        verify(mockRepo).saveCoverageForTouchstone(any(), any())
        verifyNoMoreInteractions(mockRepo)
    }

    @Test
    fun `rows are created correctly`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { createCoverageSet(any(), any(), any(), any()) } doReturn 1
        }
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock())
        sut.saveCoverageForTouchstone("t1", testSequence)
        verify(mockRepo, Times(1)).newCoverageRowRecord(1,
                "AFG",
                2020,
                BigDecimal(1),
                BigDecimal(10),
                100F.toBigDecimal(),
                78.8.toBigDecimal())
    }

    @Test
    fun `coverage records are saved to correct coverage set`()
    {
        val mockRepo = mock<TouchstoneRepository> {
            on { createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITH) } doReturn 1
            on { createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITH) } doReturn 2
            on { createCoverageSet("t1", "HepB_BD", ActivityType.CAMPAIGN, GAVISupportLevel.WITHOUT) } doReturn 3
            on { createCoverageSet("t1", "HepB_BD", ActivityType.ROUTINE, GAVISupportLevel.WITHOUT) } doReturn 4
        }
        val sut = RepositoriesCoverageLogic(mock(), mock(), mockRepo, mock())
        sut.saveCoverageForTouchstone("t1", testSequence)
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(1), any(), eq(2020), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(1), any(), eq(2021), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(2), any(), eq(2022), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(3), any(), eq(2023), any(), any(), any(), any())
        verify(mockRepo, Times(1)).newCoverageRowRecord(eq(4), any(), eq(2024), any(), any(), any(), any())
    }

}
