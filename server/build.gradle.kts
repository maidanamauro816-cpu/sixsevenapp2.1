plugins {
    kotlin("jvm") version "2.2.20"
    id("io.ktor.plugin") version "3.3.0"
    kotlin("plugin.serialization") version "2.2.20"
    application
}

group = "com.sixseven"
version = "0.1.0"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm:3.3.0")
    implementation("io.ktor:ktor-server-netty-jvm:3.3.0")
    implementation("io.ktor:ktor-server-websockets-jvm:3.3.0")
    implementation("io.ktor:ktor-server-auth-jvm:3.3.0")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:3.3.0")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:3.3.0")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:3.3.0")
    testImplementation(kotlin("test"))
    testImplementation("io.ktor:ktor-server-test-host-jvm:3.3.0")
}

tasks.test { useJUnitPlatform() }
kotlin { jvmToolchain(21) }
