package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.serialization.validation.ValidationException

class RecursiveValidationTests : ValidationTests()
{
    data class InnerTestClass(val innerNullableProp: String?, val innerNonNullableProp: String)
    data class TestClass(val inner: InnerTestClass,
                         val nullableProp: String?,
                         val nonNullableProp: String,
                         val innerNullable: InnerTestClass?)

    @Test
    fun `empty json throws validation exception`()
    {
        val badModelJson = "{}"
        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }

        try
        {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }
        catch (e: ValidationException)
        {
            val errors = e.errors
            Assertions.assertThat(errors.count()).isEqualTo(2)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:test_class:inner:missing",
                            "invalid-field:test_class:non_nullable_prop:missing"))

        }
    }

    @Test
    fun `missing inner non-nullable throws validation exception`()
    {
        val badModelJson = "{\"inner\": { }}"
        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }

        try
        {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }
        catch (e: ValidationException)
        {
            val errors = e.errors
            Assertions.assertThat(errors.count()).isEqualTo(2)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:inner_test_class:inner_non_nullable_prop:missing",
                            "invalid-field:test_class:non_nullable_prop:missing"))

        }
    }

    @Test
    fun `valid json passes validation`()
    {
        val goodModelJson = "{\"inner\": { \"inner_non_nullable_prop\": \"somevalue\" }, \"non_nullable_prop\": \"something\"}"
        binder.deserialize<TestClass>(goodModelJson, TestClass::class.java)
    }

    @Test
    fun `validates complex nullable property if not null`()
    {
        val badModelJson = "{\"inner\": { \"inner_non_nullable_prop\": \"somevalue\" }, \"inner_nullable\": { }, \"non_nullable_prop\": \"something\"}"

        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }

        try
        {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }
        catch (e: ValidationException)
        {
            val errors = e.errors
            Assertions.assertThat(errors.count()).isEqualTo(1)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:inner_test_class:inner_non_nullable_prop:missing"))

        }
    }
}