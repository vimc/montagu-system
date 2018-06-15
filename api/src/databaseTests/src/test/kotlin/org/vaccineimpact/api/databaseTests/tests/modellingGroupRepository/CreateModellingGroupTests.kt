package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.postgresql.util.PSQLException
import org.vaccineimpact.api.app.errors.DuplicateKeyError
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.ModellingGroupCreation

class CreateModellingGroupTests : ModellingGroupRepositoryTests()
{

    @Test
    fun `can create new group`()
    {
        val newGroup = ModellingGroupCreation(
                id = "HW-NewName",
                description = "some description",
                institution = "Hogwarts",
                pi = "Professor New Name")
        withRepo {
            it.createModellingGroup(newGroup)
        }
        withDatabase {
            val result = it.dsl.selectFrom(Tables.MODELLING_GROUP)
                    .where(Tables.MODELLING_GROUP.ID.eq("HW-NewName"))
                    .fetchOne()

            assertThat(result[Tables.MODELLING_GROUP.INSTITUTION]).isEqualTo("Hogwarts")
            assertThat(result[Tables.MODELLING_GROUP.PI]).isEqualTo("Professor New Name")
            assertThat(result[Tables.MODELLING_GROUP.DESCRIPTION]).isEqualTo("some description")
        }
    }

    @Test
    fun `exception is thrown for duplicate modelling group ID`()
    {
        val newGroup = ModellingGroupCreation("HW-NewName", "Hogwarts", "Professor New Name", "some description")
        withRepo {
            it.createModellingGroup(newGroup)
        }
        withRepo {
            assertThatThrownBy { it.createModellingGroup(newGroup) }
                    .isInstanceOf(PSQLException::class.java)
        }

    }


}