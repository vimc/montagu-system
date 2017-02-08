package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.Scenario

interface Repository {
    val countries: DataSet<Country, String>
    val scenarios: DataSet<Scenario, String>
    val modellingGroups: DataSet<ModellingGroup, String>
}