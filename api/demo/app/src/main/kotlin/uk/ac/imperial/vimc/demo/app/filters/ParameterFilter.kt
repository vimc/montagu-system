package uk.ac.imperial.vimc.demo.app.filters

import spark.Request

/**
 * A ParameterFilter uses its 'parameterName' property to extract a user-supplied string from the
 * queryString. It then uses its 'property' function to get a corresponding property from a model.
 * Using these, it compares them and filters out any models that do not match.
 */
class ParameterFilter<TModel>(val parameterName: String, val property: (TModel) -> String) {
    fun apply(models: Iterable<TModel>, req: Request): Iterable<TModel> {
        val value : String? = req.queryParams(parameterName)
        if (value != null) {
            return models.filter { property(it) == value }
        } else {
            return models
        }
    }
}