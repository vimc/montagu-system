package org.vaccineimpact.api.app

import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.Repository
import kotlin.reflect.KClass
import kotlin.reflect.full.starProjectedType

class SingleRepositoryActionContext<out TRepo : Repository>(
        context: SparkWebContext,
        private val repos: Repositories,
        private val repoType: KClass<*>)
    : DirectActionContext(context)
{
    val repo by lazy {
        repos.get<TRepo>(repoType::class.starProjectedType, db)
    }
}