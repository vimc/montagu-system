package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetModellingGroupTouchstoneTests : ModellingGroupRepositoryTests()
{
    private val diseaseId = "d1"
    private val groupId = "group-1"
    private val touchstoneName = "touchstoneA"
    private val touchstoneId = "touchstoneA-1"

    @Test
    fun `can get touchstones list for modelling group`()
    {
        val groupId2 = "group-2"
        val touchstoneBName = "touchstoneB"

        given {
            setUpDb(it)

            it.addGroup(groupId2)

            it.addTouchstone(touchstoneBName, "b-desc", "b-comment")
            val touchstoneB1 = it.addTouchstoneVersion(touchstoneBName, 1, "b-desc-1")
            val touchstoneB2 = it.addTouchstoneVersion(touchstoneBName, 2, "b-desc-2")
            val touchstoneB3 = it.addTouchstoneVersion(touchstoneBName, 3, "b-desc-3")


            addResponsibilitySetWithResponsibility(it, "scenario-1", groupId, touchstoneId, open = true)
            addResponsibilitySetWithResponsibility(it, "scenario-2", groupId, touchstoneB1, open = true)
            // Note that this responsibility belongs to a different group, and shouldn't be returned
            addResponsibilitySetWithResponsibility(it, "scenario-3", groupId2, touchstoneB2, open = true)
            addResponsibilitySetWithResponsibility(it, "scenario-4", groupId, touchstoneB3, open = true)

        } check { repo ->
            assertThat(repo.getTouchstonesByGroupId(groupId)).isEqualTo(listOf(
                    Touchstone(touchstoneName, "a-desc", "a-comment", listOf(
                            TouchstoneVersion("touchstoneA-1", touchstoneName, 1, "a-desc-1", TouchstoneStatus.OPEN)
                    )),
                    Touchstone(touchstoneBName, "b-desc", "b-comment", listOf(
                            TouchstoneVersion("touchstoneB-3", touchstoneBName, 3, "b-desc-3", TouchstoneStatus.OPEN),
                            TouchstoneVersion("touchstoneB-1", touchstoneBName, 1, "b-desc-1", TouchstoneStatus.OPEN)
                    ))
            ))
        }
    }

    @Test
    fun `does not return open touchstone with no responsibilities`()
    {
        given {
            setUpDb(it)

        } check { repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).hasSize(0)
        }
    }

    @Test
    fun `does not return finished touchstone with no responsibilities`()
    {
        given {
            setUpDb(it, touchstoneStatus = "finished")

        } check { repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).hasSize(0)
        }
    }

    @Test
    fun `does not return open touchstone with closed responsibilities`()
    {
        val scenarioId = "scenario-1"

        given {
            setUpDb(it)
            addResponsibilitySetWithResponsibility(it, scenarioId, groupId, touchstoneId, open = false)

        } check { repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).hasSize(0)
        }
    }

    @Test
    fun `does return finished touchstone with closed responsibilities`()
    {
        val scenarioId = "scenario-1"

        given {
            setUpDb(it, touchstoneStatus = "finished")
            addResponsibilitySetWithResponsibility(it, scenarioId, groupId, touchstoneId, open = false)

        } check { repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).hasSize(1)
        }
    }

    @Test
    fun `does return in prep touchstone with closed responsibilities`()
    {
        val scenarioId = "scenario-1"

        given {
            setUpDb(it, touchstoneStatus = "in-preparation")
            addResponsibilitySetWithResponsibility(it, scenarioId, groupId, touchstoneId, open = false)

        } check { repo ->
            val touchstones = repo.getTouchstonesByGroupId(groupId)
            assertThat(touchstones).hasSize(1)
        }
    }

    @Test
    fun `exception is thrown if tries to get touchstones by non-existent modelling group ID`()
    {
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.getTouchstonesByGroupId("bad-id")
            }.isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
        }
    }

    private fun addResponsibilitySetWithResponsibility(db: JooqContext,
                                                       scenarioId: String,
                                                       groupId: String,
                                                       touchstoneId: String,
                                                       open: Boolean = true)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneId)
        db.addScenarioDescription(scenarioId, "description 1", diseaseId, addDisease = false)
        db.addResponsibility(setId, touchstoneId, scenarioId, open = open)
    }

    private fun setUpDb(db: JooqContext, touchstoneStatus: String = "open")
    {
        db.addDisease(diseaseId)
        db.addGroup(groupId)
        db.addTouchstone(touchstoneName, "a-desc", "a-comment")
        db.addTouchstoneVersion(touchstoneName, 1,  "a-desc-1", status = touchstoneStatus)

    }

}