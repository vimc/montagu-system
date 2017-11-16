
        }
        return path
    }

}
                oneRepoEndpoint("/estimates/", this::addBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("/estimate-set/", this::createBurdenEstimateSet, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("/estimate-set/:set-id/", this::populateBurdenEstimateSet, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),
                oneRepoEndpoint("/estimates/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS) }, repos, { it.token })
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read"))
    fun createBurdenEstimateSet(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        val id = estimateRepository.createBurdenEstimateSet(path.groupId, path.touchstoneId, path.scenarioId,
                uploader = context.username!!,
                timestamp = Instant.now())

        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
        return objectCreation(context, url)
    }

    fun addBurdenEstimatesFromHTMLForm(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
        request.raw().getPart("file").inputStream.bufferedReader().use {

            // Then add the burden estimates
            val data = DataTableDeserializer.deserialize(it.readText(), BurdenEstimate::class,
                    serializer).toList()
            return saveBurdenEstimates(data, estimateRepository, context, path)
        }
    }

    fun populateBurdenEstimateSet(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>()

        if (data.map { it.disease }.distinct().count() > 1)
        {
            throw InconsistentDataError("More than one value was present in the disease column")
        }

        estimateRepository.populateBurdenEstimateSet(
                context.params(":set-id").toInt(),
                path.groupId, path.touchstoneId, path.scenarioId,
                data
        )

        return okayResponse()
    }

    open fun addBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
        }
        return path
    }

}