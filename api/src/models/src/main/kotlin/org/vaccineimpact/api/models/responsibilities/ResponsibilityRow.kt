package org.vaccineimpact.api.models.responsibilities

import org.vaccineimpact.api.models.BurdenEstimateSetStatus
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
        val estimateSetId: Int?,
        val estimateSetUploadedOn: Instant?,
        val estimateSetUploadedBy: String?,
        val estimateSetTypeType: BurdenEstimateSetTypeCode?,
        val estimateSetTypeDetails: String?,
        val estimateSetStatus: BurdenEstimateSetStatus?,
        val estimateSetProblems: String?,
        val responsibilityCommentText: String?,
        val responsibilityCommentAddedOn: Instant?,
        val responsibilityCommentAddedBy: String?
)
