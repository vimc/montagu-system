package uk.ac.imperial.vimc.demo.app.filters

abstract class InMemoryFilter<TParameters, TModel>(protected val parameters: TParameters) {
    abstract val mappers: Iterable<Mapper<TParameters, TModel, Any?>>

    fun apply(initialModels: Iterable<TModel>): Iterable<TModel> =
            mappers.fold(initialModels) { models, mapper -> models.filter { apply(it, mapper) } }

    fun apply(model: TModel, mapper: Mapper<TParameters, TModel, *>): Boolean {
        val parameter = mapper.getA(parameters)
        return parameter == null || mapper.getB(model) == parameter
    }
}