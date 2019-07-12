package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import jnr.ffi.annotations.Direct
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.ExpectationsController
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.TouchstoneModelExpectations
import org.vaccineimpact.api.models.OutcomeExpectations
import org.vaccineimpact.api.test_helpers.MontaguTests


class ExpectationsControllerTests : MontaguTests()
{
    @Test
    fun `getAllExpectations returns all expectations`()
    {

        val expectations = listOf(
                TouchstoneModelExpectations("t1-v1", "group1", "disease1",
                       OutcomeExpectations(1, "description", 1980..2000, 0..80,
                                CohortRestriction(1900, 2000), listOf("deaths", "DALYs"))),
                TouchstoneModelExpectations("t2-v2", "group2", "disease2",
                        OutcomeExpectations(2, "description2", 1981..2001, 0..90,
                                CohortRestriction(1890, 2000), listOf("deaths", "cases")))
        )

        val mockRepo = mock<ExpectationsRepository> {
            on { this.getAllExpectations() } doReturn expectations
        }

        val sut = ExpectationsController(mock<ActionContext>(), mockRepo)

        Assertions.assertThat(sut.getAllExpectations()).isEqualTo(expectations)
    }
}