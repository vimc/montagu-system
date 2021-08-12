package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

data class ResponsibilityRow(
        val touchstoneVersionId: String,
        val modellingGroupId: String,
        val responsibilitySetMissingBurdenEstimateSets: Int,
        val responsibilitySetCommentText: String?,
        val responsibilitySetCommentAddedOn: Instant?,
        val responsibilitySetCommentAddedBy: String?,
        val scenarioDescription: String,
        val scenarioDisease: String,
        val currentEstimateSetId: Int?,
        val currentEstimateSetUploadedOn: Instant?,
        val currentEstimateSetUploadedBy: String?,
        val currentEstimateSetTypeType: BurdenEstimateSetTypeCode?,
        val currentEstimateSetTypeDetails: String?,
        val currentEstimateSetMissingEstimates: Int?,
        val responsibilityCommentText: String?,
        val responsibilityCommentAddedOn: Instant?,
        val responsibilityCommentAddedBy: String?
)
