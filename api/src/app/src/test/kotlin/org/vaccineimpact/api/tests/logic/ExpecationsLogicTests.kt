package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.test_helpers.MontaguTests

class ExpectationsLogicTests: MontaguTests()
{

    @Test
    fun `gets expectations`()
    {
        val fakeExpectations = Expectations(1..11, 2000..2009, CohortRestriction(), listOf(), listOf())
        val responsibilitiesRepo = mock<ResponsibilitiesRepository>{
            on { this.getResponsibilityId("1","2","3")} doReturn 11
        }
        val expectationsRepo = mock<ExpectationsRepository> {
            on { this.getExpectationsForResponsibility(11)} doReturn fakeExpectations
        }

        val sut = RepositoriesExpectationsLogic(responsibilitiesRepo, expectationsRepo)

        val result = sut.getExpectationsForResponsibility("1", "2", "3")
        assertThat(result.ages).isEqualTo(fakeExpectations.ages)
    }
}