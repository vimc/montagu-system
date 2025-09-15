package uk.ac.imperial.vimc.demo.app.models

data class ModellingGroupEstimateListing(val group: ModellingGroup,
                                         val estimates: List<ImpactEstimateDescription>)