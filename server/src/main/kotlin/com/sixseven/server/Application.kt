package com.sixseven.server

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets
import io.ktor.server.websocket.webSocket
import io.ktor.websocket.CloseReason
import io.ktor.websocket.close

fun Application.module() {
    install(WebSockets)

    val jwtSecret = System.getenv("JWT_SECRET")
    val jwtIssuer = System.getenv("JWT_ISSUER") ?: "sixseven"
    val jwtAudience = System.getenv("JWT_AUDIENCE") ?: "sixseven-android"

    // Fail closed: never start with a missing signing secret.
    require(!jwtSecret.isNullOrBlank()) {
        "JWT_SECRET must be configured through the hosting environment."
    }

    install(Authentication) {
        jwt("auth-jwt") {
            realm = "SixSeven"
            verifier(
                JWT.require(Algorithm.HMAC256(jwtSecret))
                    .withIssuer(jwtIssuer)
                    .withAudience(jwtAudience)
                    .build()
            )
            validate { credential ->
                credential.payload.subject
                    ?.takeIf { it.isNotBlank() }
                    ?.let { JWTPrincipal(credential.payload) }
            }
        }
    }

    routing {
        get("/health") {
            call.respondText("ok")
        }

        authenticate("auth-jwt") {
            webSocket("/ws") {
                // Transport scaffold only: no message relay or persistence is enabled yet.
                // Never log message bodies or cryptographic material.
                close(
                    CloseReason(
                        CloseReason.Codes.TRY_AGAIN_LATER,
                        "Messaging transport is not configured yet"
                    )
                )
            }
        }
    }
}
