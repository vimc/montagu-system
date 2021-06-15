package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.Scenario
import org.vaccineimpact.api.models.responsibilities.*
import java.sql.Timestamp
import java.time.Instant

class JooqResponsibilitiesRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        private val touchstoneRepository: TouchstoneRepository,
        private val mapper: BurdenMappingHelper = BurdenMappingHelper()
) : JooqRepository(dsl), ResponsibilitiesRepository
{

    private fun convertScenarioToResponsibility(scenario: Scenario, responsibilityId: Int): ResponsibilityWithDatabaseId
    {
        val burdenEstimateSet = getCurrentBurdenEstimate(responsibilityId)
        val problems: MutableList<String> = mutableListOf()
        val status = if (burdenEstimateSet == null)
        {
            ResponsibilityStatus.EMPTY
        }
        else
        {
            if (burdenEstimateSet.problems.any())
            {
                problems.addAll(burdenEstimateSet.problems)
                ResponsibilityStatus.INVALID
            }
            else
            {
                ResponsibilityStatus.VALID
            }
        }
        return ResponsibilityWithDatabaseId(
                responsibilityId,
                Responsibility(scenario, status, problems, burdenEstimateSet)
        )
    }

    private fun getCurrentBurdenEstimate(responsibilityId: Int): BurdenEstimateSet?
    {
        val table = Tables.BURDEN_ESTIMATE_SET
        val records = dsl.select(Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM)
                .select(
                        table.UPLOADED_ON,
                        table.UPLOADED_BY,
                        table.SET_TYPE,
                        table.SET_TYPE_DETAILS,
                        table.STATUS,
                        table.ID,
                        table.ORIGINAL_FILENAME
                )
                .fromJoinPath(table, Tables.BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(Tables.RESPONSIBILITY)
                .on(Tables.RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET.eq(Tables.BURDEN_ESTIMATE_SET.ID))
                .where(Tables.RESPONSIBILITY.ID.eq(responsibilityId))
                .fetch()

        return mapBurdenEstimateSet(records)
    }


    private fun mapBurdenEstimateSet(input: List<Record>): BurdenEstimateSet?
    {
        if (!input.any())
        {
            return null
        }

        val first = input.first()
        val uploadedOn = first[Tables.BURDEN_ESTIMATE_SET.UPLOADED_ON].toInstant()
        return BurdenEstimateSet(
                id = first[Tables.BURDEN_ESTIMATE_SET.ID],
                uploadedBy = first[Tables.BURDEN_ESTIMATE_SET.UPLOADED_BY],
                uploadedOn = uploadedOn,
                type = mapper.mapBurdenEstimateSetType(first),
                status = mapper.mapEnum(first[Tables.BURDEN_ESTIMATE_SET.STATUS]),
                problems = input.filter { it[Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] != null }
                        .map { it[Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] },
                originalFilename = first[Tables.BURDEN_ESTIMATE_SET.ORIGINAL_FILENAME]
        )
    }

    override fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                                     scenarioFilterParameters: ScenarioFilterParameters,
                                     touchstoneVersionId: String,
                                     modellingGroupId: String): ResponsibilitySet
    {
        if (responsibilitySet != null)
        {
            val responsibilities = getResponsibilitiesInResponsibilitySet(responsibilitySet.id) {
                this.whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
            }.map {
                it.responsibility
            }
            val status = mapper.mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return ResponsibilitySet(touchstoneVersionId, modellingGroupId, status, responsibilities)
        }
        else
        {
            return ResponsibilitySet(touchstoneVersionId, modellingGroupId, ResponsibilitySetStatus.NOT_APPLICABLE, emptyList())
        }
    }

    override fun getResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityAndTouchstone
    {
        val touchstoneVersion = getTouchstoneVersion(touchstoneVersionId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneVersionId)
        if (responsibilitySet != null)
        {
            val responsibility = getResponsibilitiesInResponsibilitySet(
                    responsibilitySet.id,
                    { this.and(Tables.SCENARIO_DESCRIPTION.ID.eq(scenarioId)) }
            ).singleOrNull() ?: throw UnknownObjectError(scenarioId, "responsibility")
            return ResponsibilityAndTouchstone(responsibility.id, responsibility.responsibility, touchstoneVersion)
        }
        else
        {
            throw UnknownObjectError(scenarioId, "responsibility")
        }
    }

    override fun getResponsibilityId(groupId: String, touchstoneVersionId: String, scenarioId: String): Int
    {
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneVersionId)
        if (responsibilitySet != null)
        {
            val id = dsl.select(Tables.RESPONSIBILITY.ID)
                    .fromJoinPath(Tables.RESPONSIBILITY, Tables.SCENARIO, Tables.SCENARIO_DESCRIPTION)
                    .where(Tables.RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySet[Tables.RESPONSIBILITY_SET.ID])
                    .and(Tables.SCENARIO_DESCRIPTION.ID.eq(scenarioId)))
                    .singleOrNull()
                    ?: throw UnknownObjectError(scenarioId, "responsibility")

            return id.into(Int::class.java)
        }
        else
        {
            throw UnknownObjectError(scenarioId, "responsibility")
        }
    }

    override fun getResponsibilitiesForGroup(groupId: String, touchstoneVersionId: String,
                                             scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitySet
    {
        touchstoneRepository.touchstoneVersions.assertExists(touchstoneVersionId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneVersionId)
        return getResponsibilities(responsibilitySet, scenarioFilterParameters, touchstoneVersionId, groupId)
    }

    private fun getResponsibilitySet(groupId: String, touchstoneVersionId: String): ResponsibilitySetRecord?
    {
        return dsl.fetchAny(Tables.RESPONSIBILITY_SET,
                Tables.RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(Tables.RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId)))
    }

    override fun getResponsibilitiesForTouchstone(touchstoneVersionId: String): List<ResponsibilitySet>
    {
        val results = this.dsl.select(Tables.RESPONSIBILITY_SET.ID, Tables.RESPONSIBILITY_SET.STATUS, Tables.MODELLING_GROUP.ID)
                .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.MODELLING_GROUP)
                .where(Tables.RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                .fetch()

        return results.map {
            val id = it[Tables.RESPONSIBILITY_SET.ID] as Int
            val responsibilities = getResponsibilitiesInResponsibilitySet(id)
                    .map { it.responsibility }
            ResponsibilitySet(
                    touchstoneVersionId,
                    it[Tables.MODELLING_GROUP.ID],
                    mapper.mapEnum<ResponsibilitySetStatus>(it[Tables.RESPONSIBILITY_SET.STATUS]),
                    responsibilities
            )
        }
    }

    override fun getResponsibilitiesWithCommentsForTouchstone(touchstoneVersionId: String): List<ResponsibilitySetWithComments> =
            this.dsl.select(Tables.RESPONSIBILITY_SET.ID, Tables.MODELLING_GROUP.ID)
                    .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.MODELLING_GROUP)
                    .where(Tables.RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                    .map {
                        val responsibilitySetId = it[Tables.RESPONSIBILITY_SET.ID] as Int
                        val responsibilities = dsl
                                .select(Tables.RESPONSIBILITY.ID, Tables.SCENARIO.SCENARIO_DESCRIPTION)
                                .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.RESPONSIBILITY, Tables.SCENARIO)
                                .where(Tables.RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySetId))
                                .and(Tables.RESPONSIBILITY.IS_OPEN)
                                .map {
                                    val latestComment = dsl
                                            .select(
                                                    Tables.RESPONSIBILITY_COMMENT.COMMENT,
                                                    Tables.RESPONSIBILITY_COMMENT.ADDED_BY,
                                                    Tables.RESPONSIBILITY_COMMENT.ADDED_ON
                                            )
                                            .from(Tables.RESPONSIBILITY_COMMENT)
                                            .where(Tables.RESPONSIBILITY_COMMENT.RESPONSIBILITY.eq(it[Tables.RESPONSIBILITY.ID]))
                                            .orderBy(Tables.RESPONSIBILITY_COMMENT.ADDED_ON.desc())
                                            .fetchAnyInto(ResponsibilityComment::class.java)
                                    ResponsibilityWithComment(it[Tables.SCENARIO.SCENARIO_DESCRIPTION], latestComment)
                                }
                        ResponsibilitySetWithComments(touchstoneVersionId, it[Tables.MODELLING_GROUP.ID], responsibilities)
                    }

    override fun addResponsibilityCommentForTouchstone(touchstoneVersionId: String, groupId: String, scenarioId: String, comment: String, addedBy: String, addedOn: Instant?)
    {
        this.dsl.newRecord(Tables.RESPONSIBILITY_COMMENT).apply {
            this.responsibility = getResponsibilityId(groupId, touchstoneVersionId, scenarioId)
            this.comment = comment
            this.addedBy = addedBy
            this.addedOn = Timestamp.from(addedOn)
        }.store()
    }

    private fun getTouchstoneVersion(touchstoneVersionId: String) = touchstoneRepository.touchstoneVersions.get(touchstoneVersionId)

    private fun getResponsibilitiesInResponsibilitySet(
            responsibilitySetId: Int,
            applyWhereFilter: (SelectConditionStep<Record2<String, Int>>.() -> SelectConditionStep<Record2<String, Int>>)? = null
    ): List<ResponsibilityWithDatabaseId>
    {
        val applyWhereFilterWithDefault = applyWhereFilter ?: { this }
        val records = dsl
                .select(Tables.SCENARIO_DESCRIPTION.ID, Tables.RESPONSIBILITY.ID)
                .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.RESPONSIBILITY, Tables.SCENARIO, Tables.SCENARIO_DESCRIPTION)
                .where(Tables.RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySetId))
                // TODO remove this once VIMC-1240 is done
                // this check is needed for the situation where a group has a responsibility set with
                // multiple diseases, but we want to 'close' some and not others for a touchstoneVersion
                // it will be obsolete when we refactor responsibility sets to be single disease only
                .and(Tables.RESPONSIBILITY.IS_OPEN)
                .applyWhereFilterWithDefault()
                .fetch()
                .intoMap(Tables.SCENARIO_DESCRIPTION.ID)

        val scenarioIds = records.keys
        val scenarios = scenarioRepository.getScenarios(scenarioIds)
        return scenarios.map {
            convertScenarioToResponsibility(it, records[it.id]!![Tables.RESPONSIBILITY.ID])
        }
    }

}