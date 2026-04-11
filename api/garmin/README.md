# Strivon Garmin Sync API

Kleiner **FastAPI**-Dienst: nimmt Workouts + Garmin-Login entgegen (nur bei authentifizierten Supabase-Nutzern), lädt Einheiten in **Garmin Connect**.

## Render (kostenloser Einstieg)

Es gibt im Repo-Root ein zweites **`Dockerfile`**, falls Render den Pfad `api/garmin` im Formular nicht sauber löschen lässt:

1. Neues **Web Service** auf [render.com](https://render.com) → **Docker**.
2. **Root Directory:** **leer lassen** (Repo-Root).
3. **Dockerfile Path:** **`Dockerfile`** (nur diese eine Datei im Root).
4. **Docker Build Context:** **`.`** (Punkt) oder leer, je nach Render-UI.
5. **Pre-Deploy:** leer lassen.

Alternative: Root Directory `api/garmin`, Dockerfile Path nur `Dockerfile` (ohne `api/garmin/` — wenn die UI einen Prefix erzwingt, Root leer + Root-`Dockerfile` nutzen).

**Umgebungsvariablen**:
   - `SUPABASE_JWT_SECRET` — **Legacy JWT Secret** (JWT Keys), falls Supabase User-Tokens noch **HS256** nutzen. **Nicht** der `anon`-Key.
   - Nutzt Supabase **neue Signing Keys** (Token-Header `alg`: **ES256** / **RS256**), prüft der Dienst die Signatur automatisch per **JWKS** (`iss` aus dem Token) — das Legacy-Secret wird dann für den Login-Token nicht verwendet, muss aber für HS256-Kunden trotzdem gesetzt sein können.
   - `ALLOWED_ORIGINS` — z. B. `https://DEIN-ORG.github.io` (CORS). Ohne Eintrag: `*` (nur zum Testen).

**Port:** intern `8080` (wie im Dockerfile).

Healthcheck: `GET https://DEIN-Dienst.onrender.com/health`

## Strivon PWA

In `index.html` optional `GARMIN_API_BASE_DEFAULT` setzen, damit Nutzer die URL nicht tippen müssen.

Nutzer tragen **Sync-API-URL**, Garmin-E-Mail und -Passwort in der App ein (localStorage).

## Sicherheit

- Garmin-Passwort liegt **nicht** auf dem Server nach dem Request (nur im RAM während des Syncs).
- Zugriff nur mit gültigem **Supabase Access Token**.
- Für produktive Nutzung: Garmin-Zugangsdaten lieber **verschlüsselt in Supabase** speichern und nicht im localStorage — hier bewusst einfach für nicht-kommerziellen Gebrauch.
