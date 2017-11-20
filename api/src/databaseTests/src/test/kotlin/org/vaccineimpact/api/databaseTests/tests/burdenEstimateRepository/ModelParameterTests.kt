package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.models.ModelRun

class ModelParameterTests: BurdenEstimateRepositoryTests(){

    @Test
    fun `can add model run parameter set`()
    {
        var returnedIds: ReturnedIds? = null
        val modelRuns = listOf(ModelRun("run1", mapOf("key1" to "value1", "key2" to "value2")),
                ModelRun("run2", mapOf("key1" to "v1", "key2" to "v2")))

        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            repo.addModelRunParameterSet(returnedIds!!.responsibilitySetId, returnedIds!!.modelVersion!!,
                    "a test set", modelRuns, "test.user", timestamp)
        } andCheckDatabase { db ->
            val info = db.dsl.select()
                    .fromJoinPath(Tables.MODEL_RUN_PARAMETER_SET, Tables.UPLOAD_INFO)
                    .fetchOne()

            Assertions.assertThat(info[Tables.MODEL_RUN_PARAMETER_SET.MODEL_VERSION]).isEqualTo(returnedIds!!.modelVersion!!)
            Assertions.assertThat(info[Tables.MODEL_RUN_PARAMETER_SET.RESPONSIBILITY_SET]).isEqualTo(returnedIds!!.responsibilitySetId)
            Assertions.assertThat(info[Tables.MODEL_RUN_PARAMETER_SET.DESCRIPTION]).isEqualTo("a test set")

            Assertions.assertThat(info[Tables.UPLOAD_INFO.UPLOADED_BY]).isEqualTo("test.user")
            Assertions.assertThat(info[Tables.UPLOAD_INFO.UPLOADED_ON].toInstant()).isEqualTo(timestamp)

            val runs = db.dsl.selectFrom(Tables.MODEL_RUN)
                    .fetch()

            Assertions.assertThat(runs.count()).isEqualTo(2)

            val params = db.dsl.selectFrom(Tables.MODEL_RUN_PARAMETER)
            Assertions.assertThat(params.count()).isEqualTo(2)

            val paramValues = db.dsl.selectFrom(Tables.MODEL_RUN_PARAMETER_VALUE)
            Assertions.assertThat(paramValues.count()).isEqualTo(4)
        }
    }
}