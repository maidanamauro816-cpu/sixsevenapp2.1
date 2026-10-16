package com.sixseven.nativeapp.data.remote

import com.sixseven.nativeapp.domain.model.Message
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.client.plugins.websocket.webSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.WebSocketSession
import io.ktor.websocket.close
import io.ktor.websocket.send
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Minimal WebSocket transport. Supply an authenticated wss:// endpoint from your backend.
 * The endpoint is intentionally not hard-coded; no server is configured yet.
 */
class ChatWebSocketClient {
    private val client = HttpClient(OkHttp) { install(WebSockets) }
    private val json = Json { ignoreUnknownKeys = true }
    private var session: WebSocketSession? = null

    private val _incoming = MutableSharedFlow<Message>(extraBufferCapacity = 64)
    val incoming = _incoming.asSharedFlow()

    suspend fun connect(endpoint: String) {
        check(endpoint.startsWith("wss://")) { "Use a secure wss:// endpoint" }
        disconnect()
        val active = client.webSocketSession { url(endpoint) }
        session = active
        try {
            for (frame in active.incoming) {
                if (frame is Frame.Text) {
                    val message = json.decodeFromString<Message>(frame.readText())
                    _incoming.emit(message)
                }
            }
        } catch (e: CancellationException) {
            throw e
        } finally {
            if (session === active) session = null
        }
    }

    suspend fun send(message: Message) {
        checkNotNull(session) { "WebSocket is not connected" }
            .send(json.encodeToString(message))
    }

    suspend fun disconnect() {
        val old = session
        session = null
        old?.close()
    }

    fun close() = client.close()
}
