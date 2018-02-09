package org.vaccineimpact.api.tests.models

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateSetStatus
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

class BurdenEstimateSetTests
{
    @Test
    fun `set is stochastic if type is stochastic`()
    {
        val stochasticSet = BurdenEstimateSet(1, Instant.now(), "uploader",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC),
                BurdenEstimateSetStatus.EMPTY, emptyList())
        val centralSet = BurdenEstimateSet(1, Instant.now(), "uploader",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN),
                BurdenEstimateSetStatus.EMPTY, emptyList())
        assertThat(stochasticSet.isStochastic).isTrue()
        assertThat(centralSet.isStochastic).isFalse()
    }

    @Test
    fun `type is stochastic if type code is stochastic`()
    {
        val stochastic = BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC)
        val singleRun = BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN)
        val averaged = BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED)
        assertThat(stochastic.isStochastic()).isTrue()
        assertThat(singleRun.isStochastic()).isFalse()
        assertThat(averaged.isStochastic()).isFalse()
    }
}