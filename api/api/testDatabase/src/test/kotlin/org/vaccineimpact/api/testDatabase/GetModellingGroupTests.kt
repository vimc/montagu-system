package org.vaccineimpact.api.testDatabase

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.ModellingGroup

class GetModellingGroupTests : ModellingGroupRepositoryTests()
{
    @Test
    fun `no modelling groups are returned if table is empty`()
    {
        makeRepository().use { repo ->
            val groups = repo.getModellingGroups()
            Assertions.assertThat(groups).isEmpty()
        }
    }

    @Test
    fun `can get all modelling groups`()
    {
        withRepositoryAndGroups({
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        }, {
            repo ->
            val groups = repo.getModellingGroups()
            Assertions.assertThat(groups).hasSameElementsAs(listOf(
                    ModellingGroup("a", "description a"),
                    ModellingGroup("b", "description b")
            ))
        })
    }

    @Test
    fun `only most recent version of modelling groups is returned`()
    {
        withRepositoryAndGroups({
            it.addGroup("a2", "description a version 2")
            it.addGroup("a1", "description a version 1", current = "a2")
            it.addGroup("b", "description b")
        }, {
            repo ->
            val groups = repo.getModellingGroups()
            Assertions.assertThat(groups).hasSameElementsAs(listOf(
                    ModellingGroup("a2", "description a version 2"),
                    ModellingGroup("b", "description b")
            ))
        })
    }

    @Test
    fun `can get modelling group by ID`()
    {
        withRepositoryAndGroups({
            it.addGroup("a", "description a")
        }, {
            repo ->
            var group = repo.getModellingGroup("a")
            Assertions.assertThat(group).isEqualTo(ModellingGroup("a", "description a"))
        })
    }

    @Test
    fun `can get modelling group by any ID in its history`()
    {
        val expected = ModellingGroup("a2", "description version 2")
        withRepositoryAndGroups({
            it.addGroup("a2", "description version 2")
            it.addGroup("a1", "description version 1", current = "a2")
        }, { repo ->
            val group1 = repo.getModellingGroup("a2")
            Assertions.assertThat(group1).isEqualTo(expected)

            val group2 = repo.getModellingGroup("a1")
            Assertions.assertThat(group2).isEqualTo(expected)
        })
    }

    @Test
    fun `exception is thrown for non-existent modelling group ID`()
    {
        makeRepository().use { repo ->
            Assertions.assertThatThrownBy { repo.getModellingGroup("a") }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

}