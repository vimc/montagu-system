package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleProperty
import org.vaccineimpact.api.models.helpers.Rule
import org.vaccineimpact.api.models.helpers.SerializationRule
import java.math.BigDecimal

data class CoverageSet(
        override val id: Int,
        val touchstoneVersion: String,
        val name: String,
        val vaccine: String,
        val gaviSupport: GAVISupportLevel,
        val activityType: ActivityType
) : HasKey<Int>

data class ScenarioAndCoverageSets(
        val scenario: Scenario,
        @SerializationRule(Rule.EXCLUDE_IF_NULL)
        val coverageSets: List<CoverageSet>?
)

data class ScenarioTouchstoneAndCoverageSets(
        val touchstoneVersion: TouchstoneVersion,
        val scenario: Scenario,
        @SerializationRule(Rule.EXCLUDE_IF_NULL)
        val coverageSets: List<CoverageSet>?
)

interface CoverageRow

interface LongCoverageRow: CoverageRow {
        val scenario: String, //This is the scenario description ID
        val setName: String,
        val vaccine: String,
        val gaviSupport: GAVISupportLevel,
        val activityType: ActivityType,
        val countryCode: String,
        val country: String,
        val year: Int,
        val ageFirst: BigDecimal?,
        val ageLast: BigDecimal?,
        val ageRangeVerbatim: String?,
        val target: BigDecimal?,
        val coverage: BigDecimal?
}

data class NoGenderLongCoverageRow(
        override val scenario: String,
        override val setName: String,
        override val vaccine: String,
        override val gaviSupport: GAVISupportLevel,
        override val activityType: ActivityType,
        override val countryCode: String,
        override val country: String,
        override val year: Int,
        override val ageFirst: BigDecimal?,
        override val ageLast: BigDecimal?,
        override val ageRangeVerbatim: String?,
        override val target: BigDecimal?,
        override val coverage: BigDecimal?
) : LongCoverageRow

data class GenderedLongCoverageRow(
        override val scenario: String,
        override val setName: String,
        override val vaccine: String,
        override val gaviSupport: GAVISupportLevel,
        override val activityType: ActivityType,
        override val countryCode: String,
        override val country: String,
        override val year: Int,
        override val ageFirst: BigDecimal?,
        override val ageLast: BigDecimal?,
        override val ageRangeVerbatim: String?,
        override val target: BigDecimal?,
        override val coverage: BigDecimal?,
        val gender: String
) : LongCoverageRow


interface WideCoverageRow: CoverageRow {
        val scenario: String, //This is the scenario description ID
        val setName: String,
        val vaccine: String,
        val gaviSupport: GAVISupportLevel,
        val activityType: ActivityType,
        val countryCode: String,
        val country: String,
        val ageFirst: BigDecimal?,
        val ageLast: BigDecimal?,
        val ageRangeVerbatim: String?,
        @FlexibleProperty
        val coverageAndTargetPerYear: Map<String, BigDecimal?>
}

data class NoGenderWideCoverageRow(
        override val scenario: String, //This is the scenario description ID
        override val setName: String,
        override val vaccine: String,
        override val gaviSupport: GAVISupportLevel,
        override val activityType: ActivityType,
        override val countryCode: String,
        override val country: String,
        override val ageFirst: BigDecimal?,
        override val ageLast: BigDecimal?,
        override val ageRangeVerbatim: String?,
        @FlexibleProperty
        override val coverageAndTargetPerYear: Map<String, BigDecimal?>
) : WideCoverageRow

data class GenderedWideCoverageRow(
        override val scenario: String, //This is the scenario description ID
        override val setName: String,
        override val vaccine: String,
        override val gaviSupport: GAVISupportLevel,
        override val activityType: ActivityType,
        override val countryCode: String,
        override val country: String,
        override val ageFirst: BigDecimal?,
        override val ageLast: BigDecimal?,
        override val ageRangeVerbatim: String?,
        val gender: String,
        @FlexibleProperty
        override val coverageAndTargetPerYear: Map<String, BigDecimal?>
) : WideCoverageRow

