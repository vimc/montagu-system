package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.security.getReviewersMap
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModelReviewHelperTests : MontaguTests()
{
    @Test
    fun `can get map of reviewers`()
    {
        val result = getReviewersMap()
        assertThat(result["petra.klepac"]).containsExactly("CDA-Razavi",
                "IC-Hallett", "Cambridge-Trotter", "KPW-Jackson")
    }
}