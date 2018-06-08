package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.addTouchstone
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion

class GetTouchstonesTests : TouchstoneRepositoryTests()
{
    @Test
    fun `can get touchstones`()
    {
        withDatabase {
            it.addTouchstone("a", "a-desc", "a-comment")
            it.addTouchstoneVersion("a", 1, "a-1-desc", status = "in-preparation")
            it.addTouchstone("b", "b-desc", "b-comment")
            it.addTouchstoneVersion("b", 1, "b-1-desc", status = "finished")
        }
        withRepo {
            assertThat(it.getTouchstones()).hasSameElementsAs(listOf(
                    Touchstone("a", "a-desc", "a-comment", listOf(
                            TouchstoneVersion("a-1", "a", 1, "a-1-desc", TouchstoneStatus.IN_PREPARATION))
                    ),
                    Touchstone("b", "b-desc", "b-comment", listOf(
                            TouchstoneVersion("b-1", "b", 1, "b-1-desc", TouchstoneStatus.FINISHED))
                    )
            ))
        }
    }

    @Test
    fun `touchstone versions are returned in order from most recent to least recent`()
    {
        withDatabase {
            it.addTouchstone("a", "a-desc", "a-comment")
            it.addTouchstoneVersion("a", 1, "a-1-desc")
            it.addTouchstoneVersion("a", 2, "a-2-desc")
            it.addTouchstoneVersion("a", 3, "a-3-desc")
        }
        withRepo {
            assertThat(it.getTouchstones()).hasSameElementsAs(listOf(
                    Touchstone("a", "a-desc", "a-comment", listOf(
                            TouchstoneVersion("a-3", "a", 3, "a-3-desc", TouchstoneStatus.OPEN),
                            TouchstoneVersion("a-2", "a", 2, "a-2-desc", TouchstoneStatus.OPEN),
                            TouchstoneVersion("a-1", "a", 1, "a-1-desc", TouchstoneStatus.OPEN)
                    ))
            ))
        }
    }
}