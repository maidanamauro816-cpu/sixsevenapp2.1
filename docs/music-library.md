# Biblioteca musical SixSeven

## Estado de esta implementación

- La interfaz React incluye búsqueda, favoritos locales, búsquedas recientes, vista de tendencias iniciales y selección para compartir.
- La búsqueda consulta primero `GET /api/music/search?q=...` en el backend configurado por `VITE_MUSIC_API_URL`.
- Si el backend no está configurado o no responde, se intenta el catálogo público de Apple/iTunes como alternativa.
- Solo se reproducen previews que el proveedor entrega; la interfaz detiene el audio a los 30 segundos. Si no hay preview, se abre el enlace oficial.
- Favoritos e historial se guardan localmente en el dispositivo/navegador. Aún no están sincronizados con Firebase.
- La acción “Usar en mensaje/estado” entrega la selección al callback de la app. El chat/estado real aún requiere integración con el backend de mensajería.

## Configurar Spotify de forma segura

1. Crear una aplicación en https://developer.spotify.com/dashboard.
2. Guardar el Client ID y Client Secret como secretos del servidor, con nombres `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET`.
3. Implementar/provisionar en el backend autorizado `GET /api/music/search?q=...` para devolver una lista JSON con los campos `id`, `title`, `artist`, `album`, `artworkUrl`, `externalUrl` y `previewUrl`.
4. Configurar `VITE_MUSIC_API_URL` como URL pública de ese backend en el entorno de compilación y reconstruir la app.

**Nunca** pongas `SPOTIFY_CLIENT_SECRET` en `.env` de Vite, en el código cliente, ni en el APK: todas las variables `VITE_*` quedan expuestas al navegador. No se debe asumir que Spotify ofrece preview para todas las pistas; su disponibilidad depende del catálogo y de las condiciones vigentes de la API.

## API alternativa

El servicio usa el endpoint de búsqueda pública de Apple/iTunes como fallback de metadatos y previews disponibles. Consultar las condiciones de uso del proveedor y mostrar atribución/enlaces cuando corresponda. Las tendencias que se muestran inicialmente son sugerencias editoriales, no un ranking global en tiempo real.
