package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.security.WebTokenHelper

open class ControllerContext(
        open val urlBase: String,
        open val repositoryFactory: RepositoryFactory,
        open val tokenHelper: WebTokenHelper
)