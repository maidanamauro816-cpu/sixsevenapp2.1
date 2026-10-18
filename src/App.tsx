import { useState } from "react";
import { MessageCircle, Phone, CircleDot, Music2, Search, Plus, Settings, ChevronRight, ShieldCheck, Users, Bell, Palette, Sparkles } from "lucide-react";
import MusicLibrary from "./MusicLibrary";
import type { MusicTrack } from "./musicApiService";

type Tab = "Chats" | "Llamadas" | "Estados" | "Música" | "SixSeven AI";

const demoChats = [
  { name: "Bienvenido a SixSeven", text: "Tu espacio de comunicación empieza aquí.", time: "Ahora", initials: "S", unread: 1 },
  { name: "Contactos", text: "La búsqueda y sincronización se configurarán con tu backend.", time: "—", initials: "C", unread: 0 },
  { name: "Personalización", text: "Temas, tonos y burbujas: en preparación.", time: "—", initials: "P", unread: 0 }
];

export default function App() {
  const [tab, setTab] = useState<Tab>("Chats");
  const [query, setQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("Rojo neón");
  const tabs: { label: Tab; icon: typeof MessageCircle }[] = [
    { label: "Chats", icon: MessageCircle },
    { label: "Llamadas", icon: Phone },
    { label: "Estados", icon: CircleDot },
    { label: "Música", icon: Music2 },
    { label: "SixSeven AI", icon: Sparkles }
  ];

  const title = showSettings ? "Ajustes" : tab;
  const useTrack = (track: MusicTrack, destination: "chat" | "status") => {
    const target = destination === "chat" ? "mensaje" : "estado";
    const link = track.externalUrl ? "\n\nEnlace oficial: " + track.externalUrl : "";
    window.alert(`Canción seleccionada para ${target}:\n${track.title} — ${track.artist}${link}\n\nLa interfaz de mensajería/estados reales todavía necesita conectarse al backend.`);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark">S<span>7</span></div><div><strong>SixSeven</strong><small>COMUNICACIÓN A TU MANERA</small></div></div>
        <button className="icon-button" aria-label="Ajustes" onClick={() => setShowSettings(!showSettings)}><Settings size={20}/></button>
      </header>

      <section className="page">
        <div className="page-heading">
          <div><p className="eyebrow">TU ESPACIO PRIVADO</p><h1>{title}</h1></div>
          {!showSettings && <button className="round-add" aria-label="Nuevo" onClick={() => setTab("Chats")}><Plus size={22}/></button>}
        </div>

        {showSettings ? (
          <div className="settings-list">
            <div className="settings-card"><Palette/><div><b>Personalización</b><span>Color de acento y apariencia</span><select value={theme} onChange={e => setTheme(e.target.value)}><option>Rojo neón</option><option>Azul eléctrico</option><option>Violeta</option></select></div></div>
            <div className="settings-card"><Bell/><div><b>Tonos y notificaciones</b><span>Preferencias para llamadas y mensajes</span><small>Se activarán con los módulos nativos.</small></div></div>
            <div className="settings-card"><ShieldCheck/><div><b>Privacidad</b><span>Controles y permisos de la cuenta</span></div></div>
            <div className="settings-card"><Users/><div><b>Contactos</b><span>Requiere configurar autenticación y base de datos.</span></div></div>
          </div>
        ) : tab === "Chats" ? (
          <>
            <label className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar conversaciones"/></label>
            <div className="notice"><span className="status-dot"/><div><b>Prototipo de SixSeven 2.1</b><p>Interfaz inicial. Los mensajes reales todavía no están conectados.</p></div></div>
            <div className="section-label">RECIENTES <span>{demoChats.length} elementos de muestra</span></div>
            {demoChats.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.text.toLowerCase().includes(query.toLowerCase())).map(chat => <button className="chat-row" key={chat.name} onClick={() => window.alert("Esta conversación es una vista de demostración. El envío real se conectará al backend.")}><div className="avatar">{chat.initials}</div><div className="chat-copy"><b>{chat.name}</b><span>{chat.text}</span></div><div className="chat-meta"><small>{chat.time}</small>{chat.unread > 0 && <i>{chat.unread}</i>}</div></button>)}
            <button className="feature-card" onClick={() => setShowSettings(true)}><div className="feature-icon"><Palette/></div><div><b>Hazlo tuyo</b><span>Temas, burbujas y tonos personalizables.</span></div><ChevronRight/></button>
          </>
        ) : tab === "Llamadas" ? (
          <div className="empty-state"><div className="empty-icon"><Phone size={28}/></div><h2>Llamadas</h2><p>La interfaz está preparada. Las llamadas de audio requieren un servicio de señalización y comunicación en tiempo real.</p></div>
        ) : tab === "Estados" ? (
          <div className="empty-state"><div className="empty-icon"><CircleDot size={28}/></div><h2>Estados</h2><p>Este espacio será para compartir actualizaciones con tus contactos cuando se conecte el backend.</p></div>
        ) : tab === "Música" ? (
          <MusicLibrary onClose={() => setTab("Chats")} onUseTrack={useTrack}/>
        ) : (
          <div className="empty-state"><div className="empty-icon"><Sparkles size={28}/></div><h2>SixSeven AI</h2><p>La esfera de asistencia y las funciones de voz se conectarán al motor de IA cuando configuremos el backend seguro.</p><button className="primary-button" onClick={() => setShowSettings(true)}>Abrir ajustes</button></div>
        )}
      </section>

      {!showSettings && <nav className="bottom-nav">{tabs.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "nav-item active" : "nav-item"} onClick={() => setTab(label)}><Icon size={20}/><span>{label}</span></button>)}</nav>}
      {showSettings && <nav className="bottom-nav"><button className="nav-item active" onClick={() => setShowSettings(false)}><MessageCircle size={20}/><span>Volver a SixSeven</span></button></nav>}
      <footer>SixSeven · Versión de prueba 2.1</footer>
    </main>
  );
}
