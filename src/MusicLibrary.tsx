import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock3, ExternalLink, Heart, Music2, Pause, Play, Search, Share2, TrendingUp, X } from "lucide-react";
import { getFavorites, getRecentSearches, saveRecentSearch, searchMusic, toggleFavorite, TRENDING_SEARCHES, type MusicTrack } from "./musicApiService";

type Props = {
  onClose?: () => void;
  onUseTrack?: (track: MusicTrack, destination: "chat" | "status") => void;
};

export default function MusicLibrary({ onClose, onUseTrack }: Props) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [favorites, setFavorites] = useState<MusicTrack[]>(getFavorites);
  const [recent, setRecent] = useState<string[]>(getRecentSearches);
  const [tab, setTab] = useState<"forYou" | "trending" | "saved">("forYou");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [selected, setSelected] = useState<MusicTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const q = query.trim();
    if (!q) { setTracks([]); setError(""); setLoading(false); return; }
    const controller = new AbortController();
    timerRef.current = setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const results = await searchMusic(q, controller.signal);
        setTracks(results);
        saveRecentSearch(q);
        setRecent(getRecentSearches());
        if (!results.length) setError("No encontramos canciones para esa búsqueda.");
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "No se pudo consultar el catálogo.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => { controller.abort(); if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  async function play(track: MusicTrack) {
    if (playing === track.id) {
      audioRef.current?.pause(); setPlaying(null); return;
    }
    audioRef.current?.pause();
    if (!track.previewUrl) {
      setPlaying(null);
      if (track.externalUrl) window.open(track.externalUrl, "_blank", "noopener,noreferrer");
      else setError("Esta canción no tiene una vista previa disponible.");
      return;
    }
    const audio = new Audio(track.previewUrl);
    audioRef.current = audio;
    audio.preload = "none";
    audio.ontimeupdate = () => {
      // Previews are capped at 30 seconds even if the provider returns a longer clip.
      if (audio.currentTime >= 30) { audio.pause(); setPlaying(null); }
    };
    audio.onended = () => setPlaying(null);
    try { await audio.play(); setPlaying(track.id); setError(""); }
    catch { setError("No se pudo reproducir la vista previa en este dispositivo."); setPlaying(null); }
  }

  function favorite(track: MusicTrack) {
    setFavorites(toggleFavorite(track));
  }
  function useTrack(track: MusicTrack) { setSelected(track); }

  const visibleTracks = tab === "saved" ? favorites : tracks;
  return <div className="music-overlay" role="dialog" aria-modal="true" aria-label="Biblioteca musical">
    <section className="music-sheet">
      <div className="music-sheet-handle" />
      <header className="music-header">
        <div><p className="music-eyebrow">SIXSEVEN SOUND</p><h2>Biblioteca musical</h2><p className="music-subtitle">Encontrá la canción para cada momento.</p></div>
        <button className="music-icon-btn" onClick={onClose} aria-label="Cerrar biblioteca"><X size={20}/></button>
      </header>
      <label className="music-search"><Search size={19}/><input value={query} onChange={e => { setQuery(e.target.value); setTab("forYou"); }} placeholder="Buscar canción, artista o álbum" autoFocus/><kbd>⌕</kbd></label>
      <div className="music-tabs">
        <button className={tab === "forYou" ? "selected" : ""} onClick={() => setTab("forYou")}>Para vos</button>
        <button className={tab === "trending" ? "selected" : ""} onClick={() => { setTab("trending"); setQuery(""); }}>Tendencias</button>
        <button className={tab === "saved" ? "selected" : ""} onClick={() => { setTab("saved"); setQuery(""); }}>Guardadas <span>{favorites.length}</span></button>
      </div>
      <div className="music-scroll">
        {tab === "trending" && <div className="music-discovery"><h3><TrendingUp size={16}/> Búsquedas populares</h3><div className="music-chips">{TRENDING_SEARCHES.map(term => <button key={term} onClick={() => { setTab("forYou"); setQuery(term); }}>{term}</button>)}</div><p className="music-note">Sugerencias iniciales. Las tendencias globales reales requieren un proveedor de charts autorizado.</p></div>}
        {tab === "forYou" && !query && <div className="music-discovery"><h3><Clock3 size={16}/> Búsquedas recientes</h3>{recent.length ? <div className="music-chips">{recent.map(term => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div> : <p className="music-note">Tus búsquedas recientes van a aparecer acá.</p>}<h3 className="music-section-title"><TrendingUp size={16}/> Probá buscar</h3><div className="music-chips">{TRENDING_SEARCHES.slice(0,4).map(term => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div></div>}
        {loading && <div className="music-loading"><span/> Buscando en el catálogo…</div>}
        {error && <p className="music-error">{error}</p>}
        {tab === "saved" && !favorites.length && <div className="music-empty"><Heart size={28}/><b>Todavía no guardaste canciones</b><p>Usá el corazón de una canción para guardarla acá.</p></div>}
        {visibleTracks.map(track => <article className="music-track" key={track.provider + track.id}>
          {track.artworkUrl ? <img className="music-artwork" src={track.artworkUrl} alt={`Portada de ${track.title}`} loading="lazy"/> : <div className="music-artwork music-artwork-placeholder"><Music2/></div>}
          <button className="music-track-info" onClick={() => play(track)}><b>{track.title}</b><span>{track.artist}</span><small>{track.album || track.provider} {track.previewUrl ? " · Preview" : " · Abrir plataforma"}</small></button>
          <button className={playing === track.id ? "music-action is-playing" : "music-action"} onClick={() => play(track)} aria-label={playing === track.id ? "Pausar preview" : "Reproducir preview"}>{playing === track.id ? <Pause size={17}/> : <Play size={17}/>}</button>
          <button className={favorites.some(x => x.id === track.id && x.provider === track.provider) ? "music-action favorite-on" : "music-action"} onClick={() => favorite(track)} aria-label="Guardar canción"><Heart size={17} fill={favorites.some(x => x.id === track.id && x.provider === track.provider) ? "currentColor" : "none"}/></button>
          <button className="music-action" onClick={() => useTrack(track)} aria-label="Usar en chat o estado"><Share2 size={17}/></button>
        </article>)}
        {tab === "forYou" && query && !loading && !error && !tracks.length && <p className="music-note">Probá con otro título o artista.</p>}
      </div>
      <footer className="music-footer"><span>Previews oficiales cuando estén disponibles</span><span>♪ SixSeven</span></footer>
    </section>
    {selected && <div className="music-share-backdrop" onClick={() => setSelected(null)}><section className="music-share-card" onClick={e => e.stopPropagation()}>
      <button className="music-share-close" onClick={() => setSelected(null)} aria-label="Cerrar"><X size={18}/></button>
      <p className="music-eyebrow">COMPARTIR CANCIÓN</p><h3>{selected.title}</h3><p>{selected.artist}</p>
      <div className="music-share-preview">{selected.artworkUrl && <img src={selected.artworkUrl} alt=""/>}<div><b>{selected.title}</b><span>{selected.artist}</span><small>{selected.provider === "spotify" ? "Spotify" : "Apple Music"}</small></div><Music2/></div>
      <button className="music-primary-btn" onClick={() => { onUseTrack?.(selected, "chat"); setSelected(null); }}>Usar en mensaje</button>
      <button className="music-secondary-btn" onClick={() => { onUseTrack?.(selected, "status"); setSelected(null); }}>Usar en estado</button>
      <button className="music-secondary-btn" onClick={() => { const url = selected.externalUrl ?? ""; if (navigator.share) void navigator.share({ title: selected.title, text: selected.artist, url }).catch(() => {}); else if (url) void navigator.clipboard?.writeText(url); setSelected(null); }}><ExternalLink size={15}/> Compartir enlace oficial</button>
    </section></div>}
  </div>;
}
