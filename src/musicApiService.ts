export type MusicTrack = {
  id: string;
  provider: "spotify" | "apple";
  title: string;
  artist: string;
  album: string;
  artworkUrl: string | null;
  externalUrl: string | null;
  previewUrl: string | null;
};

const API_BASE = (import.meta.env.VITE_MUSIC_API_URL ?? "").replace(/\/$/, "");
const RECENT_KEY = "sixseven.music.recent.v1";
const FAVORITES_KEY = "sixseven.music.favorites.v1";

function readList<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, values: T[]) {
  try { localStorage.setItem(key, JSON.stringify(values)); } catch { /* storage can be disabled */ }
}

function normalizeSpotify(item: any): MusicTrack | null {
  if (!item || !item.id) return null;
  return {
    id: String(item.id),
    provider: "spotify",
    title: String(item.title ?? item.name ?? "Canción"),
    artist: String(item.artist ?? item.artists?.map((a: any) => a.name).join(", ") ?? "Artista desconocido"),
    album: String(item.album ?? item.album?.name ?? ""),
    artworkUrl: item.artworkUrl ?? item.album?.images?.[0]?.url ?? null,
    externalUrl: item.externalUrl ?? item.external_urls?.spotify ?? null,
    previewUrl: item.previewUrl ?? item.preview_url ?? null
  };
}

function normalizeApple(item: any): MusicTrack {
  return {
    id: String(item.trackId),
    provider: "apple",
    title: String(item.trackName ?? "Canción"),
    artist: String(item.artistName ?? "Artista desconocido"),
    album: String(item.collectionName ?? ""),
    artworkUrl: typeof item.artworkUrl100 === "string" ? item.artworkUrl100.replace("100x100bb", "300x300bb") : null,
    externalUrl: item.trackViewUrl ?? null,
    previewUrl: item.previewUrl ?? null
  };
}

/** Spotify is queried through our server so the client secret never ships in the APK.
 * If the endpoint isn't configured or unavailable, Apple's public catalog search is a fallback.
 */
export async function searchMusic(query: string, signal?: AbortSignal): Promise<MusicTrack[]> {
  const q = query.trim();
  if (!q) return [];
  if (q.length > 120) throw new Error("La búsqueda es demasiado larga.");

  if (API_BASE) {
    try {
      const response = await fetch(`${API_BASE}/api/music/search?q=${encodeURIComponent(q)}`, {
        signal, headers: { Accept: "application/json" }
      });
      if (response.ok) {
        const data: unknown = await response.json();
        if (Array.isArray(data)) {
          const tracks = data.map(normalizeSpotify).filter((x): x is MusicTrack => Boolean(x));
          if (tracks.length) return tracks;
        }
      }
    } catch (error) {
      if (signal?.aborted) throw error;
      // Fall through to the Apple catalog for graceful degradation.
    }
  }

  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", q);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "25");
  url.searchParams.set("country", "ar");
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) throw new Error("El catálogo musical no está disponible en este momento.");
  const data = await response.json() as { results?: any[] };
  return (data.results ?? []).filter((x) => x.trackId).map(normalizeApple);
}

export function getRecentSearches(): string[] {
  return readList<string>(RECENT_KEY);
}
export function saveRecentSearch(query: string) {
  const q = query.trim();
  if (!q) return;
  writeList(RECENT_KEY, [q, ...getRecentSearches().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 12));
}
export function getFavorites(): MusicTrack[] {
  return readList<MusicTrack>(FAVORITES_KEY);
}
export function toggleFavorite(track: MusicTrack): MusicTrack[] {
  const current = getFavorites();
  const exists = current.some((item) => item.id === track.id && item.provider === track.provider);
  const next = exists ? current.filter((item) => !(item.id === track.id && item.provider === track.provider)) : [track, ...current];
  writeList(FAVORITES_KEY, next);
  return next;
}

export const TRENDING_SEARCHES = ["Bad Bunny", "Duki", "Emilia", "Taylor Swift", "Quevedo", "Trueno"];
