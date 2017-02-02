package uk.ac.imperial.vimc.demo.app.filters

import spark.Request

/**
 * A ParameterFilterSet is a list of ParameterFilters. It applies them all to a iterable of models in turn,
 * so that all filters are applied.
 */
open class ParameterFilterSet<TModel>(filters: Iterable<ParameterFilter<TModel>>) {
    private val filters = filters.toMutableList()

    constructor(): this(emptyList())

    protected fun add(parameterName: String, property: (TModel) -> String) {
        filters.add(ParameterFilter(parameterName, property))
    }

    fun apply(initialModels: Iterable<TModel>, req: Request): Iterable<TModel> {
        return filters.fold(initialModels, { models, filter -> filter.apply(models, req) })
    }

    /**
     * Let's imagine you have a set of ParameterFilters that work on objects of type TModel.
     * You also have a bunch of objects of type TParentModel, each of which has a child TModel. You want to
     * filter the parent models based on the child models. Well, sir, you are in luck, because this method
     * _adapts_ a set of filters to work with a different model type. All you need to do is tell it how
     * to get from any given TParentModel to a child TModel, and it will build you a new ParameterFilterSet
     * of the new model type.
     */
    fun <TParentModel> adaptedFor(adapter: (TParentModel) -> TModel): ParameterFilterSet<TParentModel> {
        return ParameterFilterSet(filters.map { filter ->
            ParameterFilter<TParentModel>(filter.parameterName, { parentModel -> filter.property(adapter(parentModel)) })
        })
    }
}