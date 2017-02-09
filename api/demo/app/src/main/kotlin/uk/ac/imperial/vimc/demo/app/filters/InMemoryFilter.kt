package uk.ac.imperial.vimc.demo.app.filters

abstract class InMemoryFilter<TParameters, TModel>(protected val parameters: TParameters) {
    abstract val mappers: Iterable<Mapper<TParameters, TModel, Any?>>

    fun modelMatchesParameter(initialModels: Iterable<TModel>): Iterable<TModel> =
            mappers.fold(initialModels) { models, mapper -> models.filter { modelMatchesParameter(it, mapper) } }

    fun modelMatchesParameter(model: TModel, mapper: Mapper<TParameters, TModel, *>): Boolean {
        val parameter = mapper.getA(parameters)
        return parameter == null || mapper.getB(model) == parameter
    }
}