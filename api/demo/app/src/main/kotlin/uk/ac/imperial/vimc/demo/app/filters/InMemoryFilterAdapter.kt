package uk.ac.imperial.vimc.demo.app.filters

/**
 * Turns an InMemoryFilter that works on objects of TModel into one that works on objects of type TParentModel
 * which _contain_ a TModel. It just wraps all of one InMemoryFilter's Mapper objects in a lambda that gets the
 * TModel from the TParentModel
 */
open class InMemoryFilterAdapter<TParameters, TParentModel, TModel>(
        parameters: TParameters,
        adapter: (TParentModel) -> TModel,
        filter: InMemoryFilter<TParameters, TModel>)
    : InMemoryFilter<TParameters, TParentModel>(parameters)
{

    override val mappers = filter.mappers.map {
        Mapper<TParameters, TParentModel, Any?>(it.getA, { parentModel -> it.getB(adapter(parentModel)) })
    }
}
