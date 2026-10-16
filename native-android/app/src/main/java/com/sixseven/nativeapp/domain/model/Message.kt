package com.sixseven.nativeapp.domain.model

import kotlinx.serialization.Serializable

@Serializable
enum class MessageStatus { PENDING, SENT, DELIVERED, READ }

@Serializable
data class Message(
    val id: String,
    val conversationId: String,
    val senderId: String,
    val receiverId: String,
    val content: String,
    val timestamp: Long,
    val status: MessageStatus = MessageStatus.PENDING
)
