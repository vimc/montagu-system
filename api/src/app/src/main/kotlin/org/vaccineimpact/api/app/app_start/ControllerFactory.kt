package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.security.WebTokenHelper
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.jvm.javaType

class ControllerFactory(
        private val context: ActionContext,
        private val repositories: Repositories,
        private val webTokenHelper: WebTokenHelper
)
{
    fun instantiateController(controllerType: KClass<out Any>): Controller
    {
        val c1 = getConstructor(controllerType, ActionContext::class, Repositories::class, WebTokenHelper::class)
        val c2 = getConstructor(controllerType, ActionContext::class, Repositories::class)

        val controller = c1?.call(context, repositories, webTokenHelper)
                ?: c2?.call(context, repositories)
                ?: throw Exception("Unable to find a useable constructor for controller " + controllerType.simpleName)
        return controller as Controller
    }

    private fun getConstructor(controllerType: KClass<out Any>, vararg parameterTypes: KClass<*>): KFunction<*>?
    {
        return controllerType.constructors.firstOrNull { constructorMatches(it, *parameterTypes) }
    }

    private fun constructorMatches(constructor: KFunction<*>, vararg parameterTypes: KClass<*>): Boolean
    {
        val actual = constructor.parameters.map { it.type.javaType }
        val expected = parameterTypes.map { it.java }
        return actual == expected
    }
}