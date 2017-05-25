package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.vaccineimpact.api.db.direct.addGroup

class GetModellingGroupTests : ModellingGroupRepositoryTests()
{
    @org.junit.Test
    fun `no modelling groups are returned if table is empty`()
    {
        givenABlankDatabase() check { repo ->
            val groups = repo.getModellingGroups()
            org.assertj.core.api.Assertions.assertThat(groups).isEmpty()
        }
    }

    @org.junit.Test
    fun `can get all modelling groups`()
    {
        given {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        } check {
            repo ->
            val groups = repo.getModellingGroups()
            org.assertj.core.api.Assertions.assertThat(groups).hasSameElementsAs(listOf(
                    org.vaccineimpact.api.models.ModellingGroup("a", "description a"),
                    org.vaccineimpact.api.models.ModellingGroup("b", "description b")
            ))
        }
    }

    @org.junit.Test
    fun `only most recent version of modelling groups is returned`()
    {
        given {
            it.addGroup("a2", "description a version 2")
            it.addGroup("a1", "description a version 1", current = "a2")
            it.addGroup("b", "description b")
        } check {
            repo ->
            val groups = repo.getModellingGroups()
            org.assertj.core.api.Assertions.assertThat(groups).hasSameElementsAs(listOf(
                    org.vaccineimpact.api.models.ModellingGroup("a2", "description a version 2"),
                    org.vaccineimpact.api.models.ModellingGroup("b", "description b")
            ))
        }
    }

    @org.junit.Test
    fun `can get modelling group by ID`()
    {
        given {
            it.addGroup("a", "description a")
        } check {
            repo ->
            var group = repo.getModellingGroup("a")
            org.assertj.core.api.Assertions.assertThat(group).isEqualTo(org.vaccineimpact.api.models.ModellingGroup("a", "description a"))
        }
    }

    @org.junit.Test
    fun `can get modelling group by any ID in its history`()
    {
        val expected = org.vaccineimpact.api.models.ModellingGroup("a2", "description version 2")
        given {
            it.addGroup("a2", "description version 2")
            it.addGroup("a1", "description version 1", current = "a2")
        } check { repo ->
            val group1 = repo.getModellingGroup("a2")
            org.assertj.core.api.Assertions.assertThat(group1).isEqualTo(expected)

            val group2 = repo.getModellingGroup("a1")
            org.assertj.core.api.Assertions.assertThat(group2).isEqualTo(expected)
        }
    }

    @org.junit.Test
    fun `exception is thrown for non-existent modelling group ID`()
    {
        givenABlankDatabase() check { repo ->
            org.assertj.core.api.Assertions.assertThatThrownBy { repo.getModellingGroup("a") }.isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
        }
    }

}