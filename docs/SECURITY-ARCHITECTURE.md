# SixSeven security architecture

## Separation of protections
1. **Transport security:** expose the service only through HTTPS/WSS with valid TLS.
2. **Authentication and authorization:** validate short-lived access tokens on every protected API and WebSocket connection. A valid token must not grant access to arbitrary conversation IDs.
3. **Local database encryption:** use SQLCipher with Room on the native Android/Kotlin client. Generate a random database key and protect it with Android Keystore; never hardcode it, commit it, or log it.
4. **End-to-end encryption (E2EE):** encrypt message content on sender devices and decrypt only on authorized recipient devices. The server should store and relay opaque ciphertext plus minimal routing metadata.

## E2EE implementation policy
- Do not invent cryptographic primitives or a custom ratchet protocol.
- Select a maintained, reviewed protocol/library after checking platform support, version compatibility and license obligations.
- Signal's `libsignal` repository states that use outside Signal is unsupported and is AGPL-licensed; obtain legal review and verify current distribution terms before considering it. Do not copy Signal source code.
- Define a threat model and wire format before implementing keys: identity keys, signed prekeys, one-time prekeys, device identity, session establishment, ratchet state, authenticated associated data, key rotation, multi-device behavior, backups and account recovery.
- Server-side logs, analytics, crash reports and push payloads must not contain plaintext messages or secret key material.
- Delivery/read receipts are server events and do not prove that a user actually read a message unless the recipient client sends the receipt.

## Implementation milestones
1. Ktor health endpoint and protected WebSocket handshake (scaffold).
2. Identity provider, JWT issuance/verification, PostgreSQL schema, authorization tests and rate limits.
3. Durable encrypted-envelope storage, per-recipient routing, acknowledgements, idempotency and offline delivery.
4. Native Android SQLCipher + Android Keystore integration.
5. E2EE library/protocol selection, device key lifecycle and cross-device cryptographic tests.
6. Security review, dependency/license review, backups/restore tests, abuse controls and production monitoring.

## Secrets
Use environment/hosting secret stores. The repository must contain only placeholder names, never real secret values. Rotate any secret that has ever been committed.
