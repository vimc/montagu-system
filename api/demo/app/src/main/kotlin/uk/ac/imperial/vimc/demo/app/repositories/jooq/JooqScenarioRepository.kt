package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.TableField
import org.jooq.impl.TableImpl
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.HasKey
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository
import uk.ac.imperial.vimc.demo.app.models.ScenarioAndCoverage

@Suppress("unused")
class JooqScenarioRepository(context: JooqContext) : JooqRepository(context), ScenarioRepository {
    override val countries: DataSet<Country, String> = JooqDataSet(dsl, Tables.COUNTRY, Tables.COUNTRY.CODE, { Country(it.code, it.name) })
    override val scenarios: DataSet<Scenario, String>
        get() = TODO("not implemented") //To change initializer of created properties use File | Settings | File Templates.
    override fun getScenarios(scenarioFilterParameters: ScenarioFilterParameters): Iterable<Scenario> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
    override fun getScenarioAndCoverage(key: String): ScenarioAndCoverage {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
    override fun getScenarioCountries(scenarioId: String): List<Country> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}

class JooqDataSet<out TModel : HasKey<TKey>, TKey, TRepoModel : Record>(
        private val dsl: DSLContext,
        private val table: TableImpl<TRepoModel>,
        private val primaryKey: TableField<TRepoModel, TKey>,
        private val map: (TRepoModel) -> TModel) : DataSet<TModel, TKey> {

    override fun all(): Iterable<TModel> = dsl.fetch(table).map { map(it) }
    override fun get(key: TKey): TModel = map(dsl.fetchOne(table, primaryKey.eq(key)))

}
