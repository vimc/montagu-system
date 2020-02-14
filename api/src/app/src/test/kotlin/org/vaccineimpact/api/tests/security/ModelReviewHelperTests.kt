package org.vaccineimpact.api.tests.security

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.security.getDiseaseReviewersMap
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModelReviewHelperTests : MontaguTests()
{

    @Test
    fun `can get map of disease reviewers`()
    {
        val result = getDiseaseReviewersMap()
        assertThat(result["petra.klepac"]).containsExactly("MenA","HepB")
        assertThat(result.keys.count()).isEqualTo(24)
    }
}