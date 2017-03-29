package org.vaccineimpact.api.tests.filters

import com.nhaarman.mockito_kotlin.*
import org.jooq.Condition
import org.jooq.Field
import org.jooq.Record
import org.jooq.SelectConditionStep
import org.junit.Test
import org.vaccineimpact.api.app.filters.JooqEqualityFilter
import org.vaccineimpact.api.tests.MontaguTests

class JooqEqualityFilterTests : MontaguTests()
{
    @Test
    fun `if value is null, no filter is applied`()
    {
        val context = mockCondition()
        runFilter(parameterValue = null, field = mockField(), context = context)
        verifyZeroInteractions(context)
    }

    @Test
    fun `if value is not null, field must match`()
    {
        val field = mockField()
        val context = mockCondition()
        runFilter(parameterValue = 1, field = field, context = context)

        verify(field).eq(1)
        verify(context).and(any<Condition>())
    }

    private fun runFilter(parameterValue: Any?, field: Field<Any?>, context: SelectConditionStep<Record>)
    {
        val filter = JooqEqualityFilter<String, Any?>(field, { params -> parameterValue })
        filter.apply(context, "fake parameters")
    }

    private fun mockCondition(): SelectConditionStep<Record>
    {
        val context = mock<SelectConditionStep<Record>> {
            on { it.and(any<Condition>()) } doReturn mock<SelectConditionStep<Record>>()
        }
        return context
    }

    private fun mockField(): Field<Any?>
    {
        val field = mock<Field<Any?>> {
            on { it.eq(any<Any>()) } doReturn mock<Condition>()
        }
        return field
    }
}