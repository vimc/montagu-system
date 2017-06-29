package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.JooqContext
import kotlin.reflect.KFunction
import kotlin.reflect.KType
import kotlin.reflect.full.isSubtypeOf
import kotlin.reflect.full.starProjectedType

open class Repositories(vararg val repos: (JooqContext) -> Repository)
{
    inline fun <reified T : Repository> get(db: JooqContext): T
    {
        return get(T::class.starProjectedType, db)
    }
    fun <T : Repository> get(type: KType, db: JooqContext): T
    {
        @Suppress("UNCHECKED_CAST")
        return repos
                .filter { getReturnType(it).isSubtypeOf(type) }
                .single()
                .invoke(db) as T
    }

    fun getReturnType(x: (JooqContext) -> Repository) = (x::class as KFunction<*>).returnType
}

fun makeRepositories(): Repositories
{
    val scenarioRepository: (JooqContext) -> ScenarioRepository = { JooqScenarioRepository(it) }
    val touchstoneRepository: (JooqContext) -> TouchstoneRepository = { JooqTouchstoneRepository(it, scenarioRepository(it)) }
    val modellingGroupRepository =
    return Repositories(
            { JooqSimpleObjectsRepository(it) },
            { JooqUserRepository(it) },
            { JooqTokenRepository(it) },
            touchstoneRepository,
            scenarioRepository,
            { JooqModellingGroupRepository(it, touchstoneRepository(it), scenarioRepository(it)) }
    )
}