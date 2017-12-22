package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetTouchstoneTests : ModellingGroupRepositoryTests()
{

    @Test
    fun `can get touchstones list for modelling group`()
    {
        var groupId = "group-1"
        var groupId2 = "group-2"
        val touchstoneId = "touchstone-1"
        given {
            it.addGroup(groupId)
            it.addGroup(groupId2)
            it.addTouchstoneName("touchstone", "description")
            it.addTouchstone("touchstone", 1, description = "descr 1", status = "open")
            it.addTouchstoneName("touchstone2", "description2")
            it.addTouchstone("touchstone2", 1, description = "descr 2", status = "open")
            it.addTouchstoneName("touchstone3", "description3")
            it.addTouchstone("touchstone3", 1, description = "descr 3", status = "open")
            it.addResponsibilitySet(groupId, touchstoneId)
            it.addResponsibilitySet(groupId, "touchstone2-1")
            it.addResponsibilitySet(groupId2, "touchstone3-1")
        } check {
            repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).isInstanceOf(List::class.java)
            assertThat(touchstones).hasSize(2)
            assertThat(touchstones[0]).isEqualTo(
                    Touchstone(touchstoneId, "touchstone", 1, "descr 1", TouchstoneStatus.OPEN)
            )
        }
    }

    @Test
    fun `exception is thrown if tries to get touchstones by non-existent modelling group ID`()
    {
        var groupId = "group-1"
        var groupId2 = "group-2"
        val touchstoneId = "touchstone-1"
        given {
            it.addGroup(groupId)
            it.addTouchstoneName("touchstone", "description")
            it.addTouchstone("touchstone", 1, description = "descr 1", status = "open")
            it.addResponsibilitySet(groupId, touchstoneId)
        } check {
            repo ->
            Assertions.assertThatThrownBy {
                repo.getTouchstonesByGroupId(groupId2)
            }.isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
        }
    }
}