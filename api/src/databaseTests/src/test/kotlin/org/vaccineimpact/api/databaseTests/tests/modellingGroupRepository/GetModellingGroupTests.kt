package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.ModellingGroupDetails
import org.vaccineimpact.api.models.ResearchModel
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole

class GetModellingGroupTests : ModellingGroupRepositoryTests()
{
    @Test
    fun `no modelling groups are returned if table is empty`()
    {
        givenABlankDatabase() check { repo ->
            val groups = repo.getModellingGroups()
            assertThat(groups).isEmpty()
        }
    }

    @Test
    fun `can get all modelling groups`()
    {
        given {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        } check { repo ->
            val groups = repo.getModellingGroups()
            assertThat(groups).hasSameElementsAs(listOf(
                    ModellingGroup("a", "description a"),
                    ModellingGroup("b", "description b")
            ))
        }
    }


    @Test
    fun `getModellingGroupsForScenario only returns groups with responsibility for scenario`()
    {
        given {
            it.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            it.addTouchstoneVersion("touchstone", 2, addTouchstone = false)
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
            it.addScenarioDescription("s1desc", "desxription", "disease1", addDisease = true)
            it.addModel("m1", "a", "disease1")
            it.addResponsibilityInNewSet("a", "touchstone-1", "s1desc")
            it.addResponsibilityInNewSet("b", "touchstone-2", "s1desc")
        } check { repo ->
            val groups = repo.getModellingGroupsForScenario("s1desc", "touchstone-1")
            assertThat(groups.count()).isEqualTo(1)
            assertThat(groups[0].id).isEqualTo("a")
        }
    }

    @Test
    fun `only most recent version of modelling groups is returned`()
    {
        given {
            it.addGroup("a2", "description a version 2")
            it.addGroup("a1", "description a version 1", current = "a2")
            it.addGroup("b", "description b")
        } check { repo ->
            val groups = repo.getModellingGroups()
            assertThat(groups).hasSameElementsAs(listOf(
                    ModellingGroup("a2", "description a version 2"),
                    ModellingGroup("b", "description b")
            ))
        }
    }

    @Test
    fun `can get modelling group by ID`()
    {
        given {
            it.addGroup("a", "description a")
        } check { repo ->
            val group = repo.getModellingGroup("a")
            assertThat(group).isEqualTo(ModellingGroup("a", "description a"))
        }
    }

    @Test
    fun `can get modelling group by any ID in its history`()
    {
        val expected = ModellingGroup("a2", "description version 2")
        given {
            it.addGroup("a2", "description version 2")
            it.addGroup("a1", "description version 1", current = "a2")
        } check { repo ->
            val group1 = repo.getModellingGroup("a2")
            assertThat(group1).isEqualTo(expected)

            val group2 = repo.getModellingGroup("a1")
            assertThat(group2).isEqualTo(expected)
        }
    }

    @Test
    fun `can get modelling group details`()
    {
        val expected = ModellingGroupDetails("new-id", "description", listOf(
                ResearchModel("a2", "description A2", "citation A2", modellingGroup = "new-id"),
                ResearchModel("b", "description B", "citation B", modellingGroup = "new-id")
        ), emptyList())
        given {
            it.addGroup("new-id", "description")
            it.addGroup("old-id", "old description", current = "new-id")
            it.addDisease("disease1")
            it.addDisease("disease2")
            it.addModel("a2", "new-id", "disease1", "description A2", "citation A2")
            it.addModel("a1", "new-id", "disease1", "description A1", "citation A1", isCurrent = false)
            it.addModel("b", "new-id", "disease2", "description B", "citation B")
        } check { repo ->
            assertThat(repo.getModellingGroupDetails("old-id")).isEqualTo(expected)
            assertThat(repo.getModellingGroupDetails("new-id")).isEqualTo(expected)
        }
    }

    @Test
    fun `can get users for modelling group`()
    {
        val expected = ModellingGroupDetails("new-id", "description", emptyList(), listOf(
                "user.a",
                "user.b"
        ))
        given {
            it.addGroup("new-id", "description")
            it.addGroup("old-id", "old description", current = "new-id")
            val role = ReifiedRole("member", Scope.parse("modelling-group:new-id"))
            it.addUserWithRoles("user.a", role)
            it.addUserWithRoles("user.b", role)
        } check { repo ->
            assertThat(repo.getModellingGroupDetails("old-id")).isEqualTo(expected)
            assertThat(repo.getModellingGroupDetails("new-id")).isEqualTo(expected)
        }
    }

    @Test
    fun `can get diseases for modelling group`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addDisease(diseaseId)
            it.addModel("m1", groupId, diseaseId)
        }

        withRepo {
            assertThat(it.getDiseasesForModellingGroup(groupId)).containsExactly(diseaseId)
        }
    }

    @Test
    fun `does not get diseases for wrong modelling group`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addGroup("badId", "description")
            it.addDisease(diseaseId)
            it.addModel("m1", "badId", diseaseId)
        }

        withRepo {
            assertThat(it.getDiseasesForModellingGroup(groupId).any()).isFalse()
        }
    }

    @Test
    fun `does not get duplicate diseases`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addDisease(diseaseId)
            it.addModel("m1", groupId, diseaseId)
            it.addModel("m2", groupId, diseaseId, isCurrent = false)
        }

        withRepo {
            assertThat(it.getDiseasesForModellingGroup(groupId)).containsExactly(diseaseId)
        }
    }


    @Test
    fun `does not get groups for wrong disease`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addDisease(diseaseId)
            it.addDisease("bad-disease-id")
            it.addModel("m1", groupId, "bad-disease-id")
        }

        withRepo {
            assertThat(it.getModellingGroupsForDisease(diseaseId).any()).isFalse()
        }
    }

    @Test
    fun `does not get duplicate groups for disease`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addDisease(diseaseId)
            it.addModel("m1", groupId, diseaseId)
            it.addModel("m2", groupId, diseaseId, isCurrent = false)
        }

        withRepo {
            assertThat(it.getModellingGroupsForDisease(diseaseId)).containsExactly(groupId)
        }
    }

    @Test
    fun `can get groups for disease`()
    {
        val groupId = "g1"
        val diseaseId = "d1"
        withDatabase {
            it.addGroup(groupId, "description")
            it.addDisease(diseaseId)
            it.addModel("m1", groupId, diseaseId)
        }

        withRepo {
            assertThat(it.getModellingGroupsForDisease(diseaseId)).containsExactly(groupId)
        }
    }

    @Test
    fun `exception is thrown for non-existent modelling group ID`()
    {
        givenABlankDatabase() check { repo ->
            assertThatThrownBy { repo.getModellingGroup("a") }.isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
        }
    }

    @Test
    fun `exception is thrown when getting details for non-existent modelling group ID`()
    {
        givenABlankDatabase() check { repo ->
            assertThatThrownBy { repo.getModellingGroupDetails("a") }.isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
        }
    }

}