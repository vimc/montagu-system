package org.vaccineimpact.api.tests.errors

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.PostgresErrorHandler
import org.vaccineimpact.api.app.errors.DuplicateKeyError
import org.vaccineimpact.api.app.errors.ForeignKeyError
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.test_helpers.MontaguTests

class PostgresErrorTests : MontaguTests()
{
    val handler = PostgresErrorHandler()

    @Test
    fun `can simplify psql function`()
    {
        assertThat(handler.simplifyExpression("foo")).isEqualTo("foo")
        assertThat(handler.simplifyExpression("foo(bar)")).isEqualTo("bar")
        assertThat(handler.simplifyExpression("foo(bar(baz))")).isEqualTo("baz")
    }

    @Test
    fun `can handle foreign key error`()
    {
        val exceptionText = """values (1, 2021, 'nonsense', '1', '10', '65.5', '100.0', 'TRUE', 3) was aborted: 
ERROR: insert or update on table "coverage" violates foreign key constraint "coverage_country_fkey""""
        val fakeException = mock<Exception> {
            on { toString() } doReturn (exceptionText)
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(ForeignKeyError::class.java)
                .hasMessageContaining("Unrecognised country in row: 1, 2021, 'nonsense', '1', '10', '65.5', '100.0', 'TRUE', 3")
    }

    @Test
    fun `can handle coverage foreign key error`()
    {
        val exceptionText = """insert or update on table "coverage" violates foreign key constraint "coverage__set_vaccine_fkey
            | Detail: Key (country)=(nonsense) is not present in table "country""""".trimMargin()
        val fakeException = mock<Exception> {
            on { toString() } doReturn (exceptionText)
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(ForeignKeyError::class.java)
                .hasMessageContaining("Unrecognised country: 'nonsense'")
    }

    @Test
    fun `can handle coverage set foreign key error`()
    {
        val exceptionText = """insert or update on table "coverage" violates foreign key constraint "coverage__set_vaccine_fkey
            | Detail: Key (country)=(nonsense) is not present in table "country""""".trimMargin()
        val fakeException = mock<Exception> {
            on { toString() } doReturn (exceptionText)
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(ForeignKeyError::class.java)
                .hasMessageContaining("Unrecognised country in row: 1, 2021, 'nonsense', '1', '10', '65.5', '100.0', 'TRUE', 3")
    }

    @Test
    fun `can handle duplicate key error`()
    {
        val exceptionText = """org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "idx_user_email_unique"
Detail: Key (lower(email))=(email@example.com) already exists."""
        val fakeException = mock<Exception> {
            on { toString() } doReturn (exceptionText)
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(DuplicateKeyError::class.java)
    }

    @Test
    fun `can handle duplicate key error from inner cause`()
    {
        val innerExceptionText = """org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "idx_user_email_unique"
Detail: Key (lower(email))=(email@example.com) already exists."""
        val fakeException = mock<Exception> {
            on { toString() } doReturn ("some other text")
            on { cause } doReturn Throwable(innerExceptionText)
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(DuplicateKeyError::class.java)
    }

    @Test
    fun `strips spaces in error code`()
    {
        val exceptionText = """org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "burden_estimate_unique"
  Detail: Key (burden_estimate_set, country, year, age, burden_outcome)=(1, AFG, 1996, 50, 19) already exists."""
        val fakeException = mock<Exception> {
            on { toString() } doReturn (exceptionText)
        }
        val error = handler.handleException(fakeException) as DuplicateKeyError
        assertThat(error.problems.first().code)
                .isEqualTo("duplicate-key:burden_estimate_set,country,year,age,burden_outcome")
    }

    @Test
    fun `returns unexpected error if not duplicate key error`()
    {
        val fakeException = mock<Exception> {
            on { toString() } doReturn ("some other text")
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(UnexpectedError::class.java)
    }
}