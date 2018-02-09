package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.validation.RequiredWhen
import java.beans.ConstructorProperties
import java.time.Instant

data class BurdenEstimateSet
@ConstructorProperties("id", "uploadedOn", "uploadedBy", "problems")
constructor(
        override val id: Int,
        val uploadedOn: Instant,
        val uploadedBy: String,
        val type: BurdenEstimateSetType,
        val status: BurdenEstimateSetStatus,
        val problems: List<String>
) : HasKey<Int>
{
    fun withType(code: BurdenEstimateSetTypeCode, details: String? = null): BurdenEstimateSet
    {
        return this.copy(type = BurdenEstimateSetType(code, details))
    }

    val isStochastic = type.isStochastic()
}


data class CreateBurdenEstimateSet(
        val type: BurdenEstimateSetType,
        @RequiredWhen("isStochastic")
        val modelRunParameterSet: Int?
)
{
    fun withType(code: BurdenEstimateSetTypeCode, details: String? = null): CreateBurdenEstimateSet
    {
        return this.copy(type = BurdenEstimateSetType(code, details))
    }

    fun isStochastic() = type.isStochastic()
}

data class BurdenEstimateSetType(val type: BurdenEstimateSetTypeCode, val details: String? = null)
{
    fun isStochastic() = type.isStochastic()
}

enum class BurdenEstimateSetTypeCode
{
    CENTRAL_SINGLE_RUN,
    CENTRAL_AVERAGED,
    CENTRAL_UNKNOWN,
    STOCHASTIC
}

fun BurdenEstimateSetTypeCode.isStochastic() = this == BurdenEstimateSetTypeCode.STOCHASTIC

enum class BurdenEstimateSetStatus
{
    EMPTY,
    PARTIAL,
    COMPLETE
}