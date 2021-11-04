package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.logic.*
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.security.filterByPermission
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.responsibilities.ResponsibilityCommentPayload
import org.vaccineimpact.api.models.responsibilities.ResponsibilityRow
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithComments
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.serialization.StreamSerializable

class TouchstoneController(
        context: ActionContext,
        private val touchstoneRepo: TouchstoneRepository,
        private val scenarioLogic: ScenarioLogic,
        private val responsibilitiesRepo: ResponsibilitiesRepository,
        private val expectationsLogic: ExpectationsLogic,
        private val responsibilitiesLogic: ResponsibilitiesLogic
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories) : this(
            context,
            repositories.touchstone,
            RepositoriesScenarioLogic(
                    repositories.touchstone,
                    repositories.modellingGroup,
                    repositories.scenario),
            repositories.responsibilities,
            RepositoriesExpectationsLogic(
                    repositories.responsibilities,
                    repositories.expectations,
                    repositories.modellingGroup,
                    repositories.touchstone
            ),
            RepositoriesResponsibilitiesLogic(repositories)
    )

    private val touchstonePreparer = ReifiedPermission("touchstones.prepare", Scope.Global())

    fun getTouchstones(): List<Touchstone>
    {
        return touchstoneRepo.getTouchstones().filterByPermission(context)
    }

    fun getScenarios(): List<ScenarioAndCoverageSets>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val filterParams = ScenarioFilterParameters.fromContext(context)

        return scenarioLogic.getScenariosAndCoverageSetsForTouchstone(touchstoneVersion.id,
                coverageReadingScopes(),
                filterParams)
    }

    fun getScenario(): ScenarioTouchstoneAndCoverageSets
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val scenarioDescriptionId: String = context.params(":scenario-id")

        return scenarioLogic.getScenarioTouchstoneAndCoverageSets(touchstoneVersion,
                scenarioDescriptionId, coverageReadingScopes())
    }

    private fun coverageReadingScopes() = context.permissions
            .filter { it.name == "coverage.read" }
            .map { it.scope }

    fun getResponsibilities(): List<ResponsibilitySetWithExpectations>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        return expectationsLogic.getResponsibilitySetsWithExpectations(touchstoneVersion.id)
    }

    fun getResponsibilitiesWithComments(): List<ResponsibilitySetWithComments>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        return responsibilitiesRepo.getResponsibilitiesWithCommentsForTouchstone(touchstoneVersion.id)
    }

    fun addResponsibilityComment(): String
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val groupId = context.params(":group-id")
        val comment = context.postData<ResponsibilityCommentPayload>().comment
        val scenarioDescriptionId: String = context.params(":scenario-id")
        val userName = context.username!!
        responsibilitiesRepo.addResponsibilityCommentForTouchstone(
                touchstoneVersion.id,
                groupId,
                scenarioDescriptionId,
                comment,
                userName
        )
        return okayResponse()
    }

    fun addResponsibilitySetComment(): String
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val groupId = context.params(":group-id")
        val comment = context.postData<ResponsibilityCommentPayload>().comment
        val userName = context.username!!
        responsibilitiesRepo.addResponsibilitySetCommentForTouchstone(
                touchstoneVersion.id,
                groupId,
                comment,
                userName
        )
        return okayResponse()
    }

    fun getResponsibilitiesData(): StreamSerializable<ResponsibilityRow>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val filename = "responsibilities_${touchstoneVersion.id}.csv"
        context.addAttachmentHeader(filename)
        val data = responsibilitiesLogic.getTouchstoneResponsibilitiesData(touchstoneVersion.id)
        return DataTable.new(data.asSequence())
    }

    fun getDemographicDatasets(): List<DemographicDataset>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        return touchstoneRepo.getDemographicDatasets(touchstoneVersion.id)
    }

    fun getDemographicDataAndMetadata():
            SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstoneVersion = touchstoneVersion(context, touchstoneRepo)
        val source = context.params(":source-code")
        val type = context.params(":type-code")
        val gender = context.queryParams("gender")
        val format = context.queryParams("format")

        val splitData =
                touchstoneRepo.getDemographicData(type, source, touchstoneVersion.id, gender ?: "both")

        val tableData = when (format)
        {

            "wide" -> getWideDemographicDatatable(splitData.tableData.data)
            "long", null -> splitData.tableData
            else -> throw BadRequest("Format '$format' not a valid csv format. Available formats are 'long' " +
                    "and 'wide'.")
        }

        return SplitData(splitData.structuredMetadata, tableData)
    }

    private fun getWideDemographicDatatable(data: Sequence<LongDemographicRow>):
            FlexibleDataTable<WideDemographicRow>
    {
        val groupedRows = data
                .groupBy { Triple(it.countryCode, it.ageFrom, it.ageTo) }

        val rows = groupedRows.values
                .map {
                    mapWideDemographicRow(it)
                }

        // all the rows should have the same number of years, so we just look at the first row
        val years = rows.first().valuesPerYear.keys.toList()

        return FlexibleDataTable.new(rows.asSequence(), years)
    }

    fun getDemographicData()
            : StreamSerializable<DemographicRow>
    {
        val data = getDemographicDataAndMetadata()
        val metadata = data.structuredMetadata
        val source = context.params(":source-code")
        val gender = context.queryParams("gender") ?: "both"
        val filename = "${metadata.touchstoneVersion.id}_${source}_${metadata.demographicData.id}_$gender.csv"
        context.addAttachmentHeader(filename)

        return data.tableData
    }

    private fun mapWideDemographicRow(records: List<LongDemographicRow>)
            : WideDemographicRow
    {
        // all records have same country, gender, age_from and age_to, so can look at first one for these
        val reference = records.first()

        val valuesPerYear = records.associateBy(
                { it.year },
                { it.value })

        return WideDemographicRow(reference.countryCodeNumeric,
                reference.countryCode,
                reference.country,
                reference.ageFrom,
                reference.ageTo,
                reference.gender,
                valuesPerYear)
    }

    private fun touchstoneVersion(context: ActionContext, repo: TouchstoneRepository): TouchstoneVersion
    {
        val id = context.params(":touchstone-version-id")
        val touchstoneVersion = repo.touchstoneVersions.get(id)
        if (touchstoneVersion.status == TouchstoneStatus.IN_PREPARATION)
        {
            context.requirePermission(touchstonePreparer)
        }
        return touchstoneVersion
    }

}