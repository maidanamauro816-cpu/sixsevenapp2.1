import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft, Bell, Check, CheckCheck, CircleDot, LockKeyhole, MessageCircle,
  MoreVertical, Music2, Paperclip, Palette, Phone, Plus, Search, Send,
  Settings, ShieldCheck, Smile, UserRound, Users, Video, X
} from "lucide-react";

type Tab = "Chats" | "Llamadas" | "Estados" | "Música" | "Perfil";
type Message = { id: string; text: string; time: string; mine: boolean };
type Chat = {
  id: string; name: string; initials: string; text: string; time: string;
  unread: number; online: boolean; messages: Message[];
};

const initialChats: Chat[] = [
  { id: "alex", name: "Alex", initials: "A", text: "Dale, hablamos después 🔥", time: "14:32", unread: 2, online: true,
    messages: [
      { id: "a1", text: "¿Todo bien? 😎", time: "14:28", mine: false },
      { id: "a2", text: "Todo tranqui, ¿vos?", time: "14:29", mine: true },
      { id: "a3", text: "Dale, hablamos después 🔥", time: "14:32", mine: false }
    ] },
  { id: "friends", name: "Los pibes ⚡", initials: "LP", text: "Martín: ¿Quién juega hoy?", time: "14:27", unread: 4, online: false,
    messages: [{ id: "f1", text: "¿Quién juega hoy?", time: "14:27", mine: false }] },
  { id: "sofi", name: "Sofi", initials: "S", text: "Jajaja 😂❤️", time: "13:51", unread: 0, online: true,
    messages: [{ id: "s1", text: "Jajaja 😂❤️", time: "13:51", mine: false }] },
  { id: "sixseven", name: "SixSeven", initials: "S⁷", text: "Bienvenido a tu espacio.", time: "Ayer", unread: 0, online: false,
    messages: [{ id: "w1", text: "Bienvenido a SixSeven. Tu espacio, tus amigos, tus reglas. 🖤", time: "Ayer", mine: false }] }
];

const tabs: { label: Tab; icon: typeof MessageCircle }[] = [
  { label: "Chats", icon: MessageCircle }, { label: "Llamadas", icon: Phone },
  { label: "Estados", icon: CircleDot }, { label: "Música", icon: Music2 },
  { label: "Perfil", icon: UserRound }
];

export default function App() {
  const [tab, setTab] = useState<Tab>("Chats");
  const [query, setQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("Rojo neón");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newContact, setNewContact] = useState("");
  const activeChat = chats.find(chat => chat.id === activeChatId) ?? null;
  const filteredChats = useMemo(() => chats.filter(chat =>
    chat.name.toLowerCase().includes(query.toLowerCase()) ||
    chat.text.toLowerCase().includes(query.toLowerCase())
  ), [chats, query]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeChat) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const message: Message = { id: crypto.randomUUID(), text, time: now, mine: true };
    setChats(current => current.map(chat => chat.id === activeChat.id
      ? { ...chat, messages: [...chat.messages, message], text, time: now }
      : chat));
    setDraft("");
  }

  function createConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newContact.trim();
    if (!name) return;
    const id = `local-${Date.now()}`;
    const chat: Chat = { id, name, initials: name.slice(0, 2).toUpperCase(), text: "Conversación local creada", time: "Ahora", unread: 0, online: false, messages: [] };
    setChats(current => [chat, ...current]);
    setActiveChatId(id);
    setTab("Chats");
    setShowNewChat(false);
    setNewContact("");
  }

  const title = showSettings ? "Ajustes" : activeChat ? activeChat.name : tab;

  return (
    <main className={`app-shell theme-${theme.toLowerCase().replaceAll(" ", "-")}`}>
      <header className="topbar">
        <div className="brand">
          {activeChat && !showSettings
            ? <button className="icon-button back-button" aria-label="Volver a chats" onClick={() => setActiveChatId(null)}><ArrowLeft size={20}/></button>
            : <div className="brand-mark" aria-label="Logo SixSeven">S<span>7</span></div>}
          <div><strong>SixSeven</strong><small>CHAT · CONNECT · REPEAT</small></div>
        </div>
        <div className="top-actions">
          {activeChat && !showSettings && <><button className="icon-button" aria-label="Llamada de voz" title="Llamada de voz"><Phone size={18}/></button><button className="icon-button" aria-label="Videollamada" title="Videollamada"><Video size={18}/></button></>}
          <button className="icon-button" aria-label="Ajustes" onClick={() => { setShowSettings(!showSettings); setActiveChatId(null); }}><Settings size={19}/></button>
        </div>
      </header>

      <section className={activeChat && !showSettings ? "page chat-page" : "page"}>
        <div className="page-heading">
          <div><p className="eyebrow">{activeChat ? (activeChat.online ? "● EN LÍNEA" : "CONVERSACIÓN") : showSettings ? "TU EXPERIENCIA" : "TU ESPACIO PRIVADO"}</p><h1>{title}</h1></div>
          {!showSettings && !activeChat && <button className="round-add" aria-label="Nueva conversación" onClick={() => setShowNewChat(true)}><Plus size={22}/></button>}
          {activeChat && <button className="icon-button" aria-label="Más opciones"><MoreVertical size={20}/></button>}
        </div>

        {showSettings ? (
          <div className="settings-list">
            <div className="settings-card"><Palette/><div><b>Personalización</b><span>Elegí el estilo de SixSeven</span><select value={theme} onChange={e => setTheme(e.target.value)}><option>Rojo neón</option><option>Azul eléctrico</option><option>Violeta</option></select></div></div>
            <div className="settings-card"><Bell/><div><b>Tonos y notificaciones</b><span>Preferencias de llamadas y mensajes</span><small>Los tonos del sistema requieren integración Android nativa.</small></div></div>
            <div className="settings-card"><ShieldCheck/><div><b>Privacidad y seguridad</b><span>La conexión cifrada y los controles de cuenta se activarán al integrar el backend.</span></div></div>
            <div className="settings-card"><LockKeyhole/><div><b>Cifrado de mensajes</b><span>SQLCipher y cifrado de extremo a extremo: en desarrollo, todavía no activo.</span></div></div>
            <div className="settings-card"><Users/><div><b>Contactos</b><span>La búsqueda global requiere cuentas registradas y un servidor.</span></div></div>
          </div>
        ) : activeChat ? (
          <>
            <div className="chat-security-note"><LockKeyhole size={14}/><span>Vista de demostración · mensajes solo en este dispositivo</span></div>
            <div className="message-list">
              {activeChat.messages.map(message => <div key={message.id} className={message.mine ? "message-line mine" : "message-line"}>
                <div className="message-bubble"><p>{message.text}</p><small>{message.time} {message.mine && <CheckCheck size={13}/>}</small></div>
              </div>)}
              {activeChat.messages.length === 0 && <div className="empty-chat">Saludá a {activeChat.name} 👋<span>Esta conversación todavía no tiene mensajes.</span></div>}
            </div>
            <form className="composer" onSubmit={sendMessage}>
              <button type="button" className="composer-tool" aria-label="Emojis" onClick={() => setDraft(value => value + " 😊")}><Smile size={21}/></button>
              <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Escribí un mensaje..." aria-label="Mensaje"/>
              <button type="button" className="composer-tool" aria-label="Adjuntar archivo" title="Los archivos se habilitarán en la integración nativa"><Paperclip size={19}/></button>
              <button className="send-button" type="submit" aria-label="Enviar mensaje" disabled={!draft.trim()}><Send size={18}/></button>
            </form>
          </>
        ) : tab === "Chats" ? (
          <>
            <label className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar chats o contactos"/></label>
            <div className="quick-actions">
              <button onClick={() => setShowNewChat(true)}><span><Users size={19}/></span><b>Nuevo chat</b></button>
              <button onClick={() => setTab("Estados")}><span><CircleDot size={19}/></span><b>Estados</b></button>
              <button onClick={() => setShowSettings(true)}><span><Palette size={19}/></span><b>Temas</b></button>
            </div>
            <div className="section-label">MENSAJES <span>{filteredChats.length} conversaciones</span></div>
            {filteredChats.map(chat => <button className="chat-row" key={chat.id} onClick={() => setActiveChatId(chat.id)}>
              <div className="avatar">{chat.initials}{chat.online && <i className="online-dot"/>}</div>
              <div className="chat-copy"><b>{chat.name}</b><span>{chat.text}</span></div>
              <div className="chat-meta"><small>{chat.time}</small>{chat.unread > 0 && <i>{chat.unread}</i>}</div>
            </button>)}
            {filteredChats.length === 0 && <div className="empty-state"><Search size={24}/><h2>No encontramos chats</h2><p>Probá con otro nombre o iniciá una conversación nueva.</p></div>}
            <div className="feature-card"><div className="feature-icon"><ShieldCheck/></div><div><b>Tu espacio. Tu identidad.</b><span>SixSeven está construyendo una mensajería independiente.</span></div></div>
          </>
        ) : tab === "Llamadas" ? (
          <div className="empty-state"><div className="empty-icon"><Phone size={28}/></div><h2>Tus llamadas</h2><p>El historial y las llamadas de audio/video necesitan señalización, permisos Android y un servicio multimedia.</p></div>
        ) : tab === "Estados" ? (
          <div className="status-view"><div className="status-own"><div className="avatar status-ring">S⁷</div><div><b>Mi estado</b><span>Compartí una foto o un momento</span></div><button className="round-add" onClick={() => alert("La publicación de estados se habilitará al integrar el backend y la carga de multimedia.")}><Plus size={20}/></button></div><div className="empty-state"><div className="empty-icon"><CircleDot size={28}/></div><h2>Estados de tus amigos</h2><p>Cuando conectemos las cuentas reales, acá vas a ver las actualizaciones de tus contactos.</p></div></div>
        ) : tab === "Música" ? (
          <div className="empty-state"><div className="empty-icon"><Music2 size={28}/></div><h2>Música</h2><p>El reproductor y la selección de archivos locales se integrarán en una siguiente etapa.</p></div>
        ) : (
          <div className="profile-card"><div className="profile-avatar">S⁷</div><h2>Tu perfil SixSeven</h2><p>Personalizá tu identidad y conectate con tus amigos.</p><button className="primary-button" onClick={() => setShowSettings(true)}>Personalizar perfil</button><div className="profile-security"><LockKeyhole size={16}/> Seguridad y privacidad en desarrollo</div></div>
        )}
      </section>

      {!showSettings && !activeChat && <nav className="bottom-nav">{tabs.map(({label, icon: Icon}) => <button key={label} className={tab === label ? "nav-item active" : "nav-item"} onClick={() => setTab(label)}><Icon size={20}/><span>{label}</span></button>)}</nav>}
      {(showSettings || activeChat) && <nav className="bottom-nav"><button className="nav-item active" onClick={() => { setShowSettings(false); setActiveChatId(null); setTab("Chats"); }}><MessageCircle size={20}/><span>Volver a chats</span></button></nav>}
      <footer>SixSeven · Tu espacio, tu identidad</footer>

      {showNewChat && <div className="modal-backdrop" role="presentation" onClick={() => setShowNewChat(false)}><section className="new-chat-modal" role="dialog" aria-modal="true" aria-labelledby="new-chat-title" onClick={event => event.stopPropagation()}>
        <div className="modal-heading"><div><p className="eyebrow">CONECTÁ</p><h2 id="new-chat-title">Nuevo chat</h2></div><button className="icon-button" aria-label="Cerrar" onClick={() => setShowNewChat(false)}><X size={19}/></button></div>
        <form onSubmit={createConversation}><label htmlFor="contact-name">Nombre del contacto</label><input id="contact-name" value={newContact} onChange={event => setNewContact(event.target.value)} placeholder="Escribí un nombre" autoFocus/><p>Esto crea una conversación local de demostración. Para encontrar usuarios reales hace falta conectar el servidor.</p><button className="primary-button" type="submit" disabled={!newContact.trim()}>Crear conversación</button></form>
      </section></div>}
    </main>
  );
}
