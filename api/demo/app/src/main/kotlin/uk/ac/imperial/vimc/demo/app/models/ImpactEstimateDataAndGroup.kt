package uk.ac.imperial.vimc.demo.app.models

data class ImpactEstimateDataAndGroup(val group: ModellingGroup,
                                      val estimate: ImpactEstimateDescription,
                                      val outcomes: List<CountryOutcomes>)