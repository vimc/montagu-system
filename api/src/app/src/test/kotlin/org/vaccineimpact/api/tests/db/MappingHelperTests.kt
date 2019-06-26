package org.vaccineimpact.api.tests.db

import org.junit.Test
import org.vaccineimpact.api.app.repositories.jooq.mapping.MappingHelper
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.assertj.core.api.Assertions.assertThat

class MappingHelperTests: MontaguTests()
{
    @Test
    fun `can map GAVISupportLevels from database values`()
    {
        val sut = MappingHelper()

        assertThat(sut.mapEnum<GAVISupportLevel>("none")).isEqualTo(GAVISupportLevel.NONE)
        assertThat(sut.mapEnum<GAVISupportLevel>("without")).isEqualTo(GAVISupportLevel.WITHOUT)
        assertThat(sut.mapEnum<GAVISupportLevel>("with")).isEqualTo(GAVISupportLevel.WITH)
        assertThat(sut.mapEnum<GAVISupportLevel>("high")).isEqualTo(GAVISupportLevel.HIGH)
        assertThat(sut.mapEnum<GAVISupportLevel>("low")).isEqualTo(GAVISupportLevel.LOW)
        assertThat(sut.mapEnum<GAVISupportLevel>("bestcase")).isEqualTo(GAVISupportLevel.BESTCASE)
        assertThat(sut.mapEnum<GAVISupportLevel>("status_quo")).isEqualTo(GAVISupportLevel.STATUS_QUO)
        assertThat(sut.mapEnum<GAVISupportLevel>("continue")).isEqualTo(GAVISupportLevel.CONTINUE)
        assertThat(sut.mapEnum<GAVISupportLevel>("gavi_optimistic")).isEqualTo(GAVISupportLevel.GAVI_OPTIMISTIC)
        assertThat(sut.mapEnum<GAVISupportLevel>("intensified")).isEqualTo(GAVISupportLevel.INTENSIFIED)
    }

}