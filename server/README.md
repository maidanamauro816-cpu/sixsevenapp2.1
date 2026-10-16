# SixSeven backend (Ktor)

This folder is an isolated Kotlin/JVM backend scaffold. It does not replace the existing React/Vite/Capacitor app.

## Requirements
- JDK 21
- Gradle (or add a Gradle Wrapper before deploying)
- A strong, randomly generated `JWT_SECRET` supplied by the hosting provider
- Set `JWT_ISSUER` and `JWT_AUDIENCE` consistently with the identity service that issues tokens

## Local run
From this directory, set environment variables and run with Gradle:

```bash
export JWT_SECRET='use-a-random-secret-of-at-least-32-bytes-from-your-secret-manager'
export JWT_ISSUER='sixseven'
export JWT_AUDIENCE='sixseven-android'
gradle run
```

The `/health` endpoint is a health check. `/ws` requires a valid JWT bearer token, but intentionally closes the connection until authenticated routing, persistence, rate limits and delivery acknowledgements are implemented.

## Security status
This is a buildable foundation, **not a production messaging server**. No token issuer, user database, message database, contact service, relay, push notifications or end-to-end encryption is implemented yet. Do not expose it as a functioning chat service.

Do not commit secrets, production tokens, private keys, database credentials or keystore files. Configure secrets in the hosting provider's secret manager and GitHub Actions secrets only when a workflow genuinely needs them.
