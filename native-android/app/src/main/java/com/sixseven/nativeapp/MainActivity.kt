package com.sixseven.nativeapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val NeonRed = Color(0xFFFF1744)
private val Background = Color(0xFF080808)
private val Panel = Color(0xFF171717)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                SixSevenHome()
            }
        }
    }
}

@Composable
private fun SixSevenHome() {
    Surface(modifier = Modifier.fillMaxSize(), color = Background) {
        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("S", color = NeonRed, fontSize = 42.sp, fontWeight = FontWeight.Black)
                Column(modifier = Modifier.padding(start = 12.dp)) {
                    Text("SIXSEVEN", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Text("MENSAJERÍA NATIVA · 2.1", color = NeonRed, fontSize = 11.sp)
                }
            }
            Text("Tus conversaciones", color = Color.White, fontSize = 25.sp, fontWeight = FontWeight.Bold)
            ChatPlaceholder("Bienvenido a SixSeven", "La base nativa Android está preparada para desarrollarse.")
            ChatPlaceholder("Chats", "La conexión real requiere configurar el servidor.")
            ChatPlaceholder("Contactos", "La sincronización de usuarios se añadirá en la siguiente fase.")
        }
    }
}

@Composable
private fun ChatPlaceholder(title: String, subtitle: String) {
    Column(
        modifier = Modifier.fillMaxWidth()
            .background(Panel, RoundedCornerShape(16.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Text(title, color = Color.White, fontWeight = FontWeight.SemiBold)
        Text(subtitle, color = Color.LightGray, fontSize = 13.sp)
    }
}
