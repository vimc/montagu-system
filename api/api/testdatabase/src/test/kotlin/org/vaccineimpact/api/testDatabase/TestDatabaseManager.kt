package org.vaccineimpact.api.testDatabase

import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.api.model.ExposedPort
import com.github.dockerjava.api.model.PortBinding
import com.github.dockerjava.api.model.Ports
import com.github.dockerjava.core.DefaultDockerClientConfig
import com.github.dockerjava.core.DockerClientBuilder
import org.vaccineimpact.api.app.Config

object TestDatabaseManager
{
    val imageURL = Config["database_test.image"]
    val exposedPort = Config.getInt("database_test.exposed_port")
    val externalPort = Config.getInt("database_test.external_port")

    private val dockerClient: DockerClient by lazy {
        val config = DefaultDockerClientConfig
                .createDefaultConfigBuilder()
                .withDockerHost(Config["docker_host"])
                .build()
        DockerClientBuilder.getInstance(config).build()
    }
    private var containerId: String? = null

    @Synchronized
    fun startDatabase()
    {
        if (containerId == null)
        {
            println("Starting containerised database:")
            println("\tImage: $imageURL")
            println("\tMapping exposed port $exposedPort to external port $externalPort")
            println("\tPlaning to connect using ${Config["db.url"]}")
            val binding = PortBinding(
                    Ports.Binding.bindPort(externalPort),
                    ExposedPort(exposedPort)
            )
            val container = dockerClient.createContainerCmd(imageURL)
                    .withPortBindings(binding)
                    .exec()
            containerId = container.id
            dockerClient.startContainerCmd(container.id).exec()
            Thread.sleep(30000)
            println("Container started")
        }
    }

    @Synchronized
    fun stopDatabase()
    {
        val id = containerId
        if (id != null)
        {
            println("Stopping containerised database")
            dockerClient.stopContainerCmd(id).exec()
            dockerClient.removeContainerCmd(id).exec()
        }
    }
}