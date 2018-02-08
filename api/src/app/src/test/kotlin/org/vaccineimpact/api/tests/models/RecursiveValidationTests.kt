package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.validation.MinimumLength
import org.vaccineimpact.api.serialization.validation.ValidationException

class RecursiveValidationTests : ValidationTests()
{
    data class InnerTestClass(val innerNullableProp: String?, val innerNonNullableProp: String)
    data class Nested(@MinimumLength(2) val minLengthValue: String)
    data class TestClass(val inner: InnerTestClass,
                         val nullableProp: String?,
                         val nonNullableProp: String,
                         val innerNullable: InnerTestClass?,
                         val nested: Nested?)

    @Test
    fun `empty json throws validation exception`()
    {
        val badModelJson = "{}"

        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }.matches {
            val errors = (it as ValidationException).errors
            assertThat(errors).hasSize(2)
            assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:inner:missing",
                            "invalid-field:non_nullable_prop:missing"))
            true
        }
    }

    @Test
    fun `missing inner non-nullable throws validation exception`()
    {
        val badModelJson = "{\"inner\": { }}"

        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }.matches {
            val errors = (it as ValidationException).errors
            Assertions.assertThat(errors).hasSize(2)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:inner:inner_non_nullable_prop:missing",
                            "invalid-field:non_nullable_prop:missing"))
            true
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
        }.matches {
            val errors = (it as ValidationException).errors
            Assertions.assertThat(errors.count()).isEqualTo(1)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:inner_nullable:inner_non_nullable_prop:missing"))
            true
        }
    }

    @Test
    fun `nested property rule gets validated`()
    {
        val badModelJson = "{\"inner\": { \"inner_non_nullable_prop\": \"somevalue\" }, \"nested\": { \"min_length_value\": \"a\"}}"

        Assertions.assertThatThrownBy {
            binder.deserialize<TestClass>(badModelJson, TestClass::class.java)
        }.matches {
            val errors = (it as ValidationException).errors
            Assertions.assertThat(errors.count()).isEqualTo(2)
            Assertions.assertThat(errors.map { it.code })
                    .hasSameElementsAs(listOf("invalid-field:non_nullable_prop:missing",
                            "invalid-field:nested:min_length_value:too-short"))
            true
        }
    }
}