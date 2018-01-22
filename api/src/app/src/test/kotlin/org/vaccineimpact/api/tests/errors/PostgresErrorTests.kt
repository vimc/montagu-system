package org.vaccineimpact.api.tests.errors

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ErrorHandler
import org.vaccineimpact.api.app.PostgresErrorHandler
import org.vaccineimpact.api.app.errors.DuplicateKeyError
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
    fun `returns unexpected error if not duplicate key error`()
    {
         val fakeException = mock<Exception> {
            on { toString() } doReturn ("some other text")
        }
        val error = handler.handleException(fakeException)
        assertThat(error).isInstanceOf(UnexpectedError::class.java)
    }
}