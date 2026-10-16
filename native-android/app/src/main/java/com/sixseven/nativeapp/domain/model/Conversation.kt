package com.sixseven.nativeapp.domain.model

data class Conversation(
    val id: String,
    val participantIds: List<String>,
    val lastMessage: Message? = null,
    val unreadCount: Int = 0,
    val updatedAt: Long = System.currentTimeMillis()
)
