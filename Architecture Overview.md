K-pop Music Hub is a full-stack web application that combines a YouTube-based music player with a structured K-pop group / idol / album database.
The stack is:
Frontend: React SPA
Backend: Node.js + Express
Database: PostgreSQL
Auth: Keycloak (OIDC)
External sources: YouTube IFrame / Data APIs, KProfiles pages for scraping


1. High-level Architecture
[ React SPA ]  <——>  [ Express API ]  <——>  [ PostgreSQL ]
      │                    │
      │                    └── Scraping / YouTube API clients
      │
      └── Keycloak (login, tokens)
The React app is the only public UI, serving both normal users and admins.
The Express API is the single backend entry point for all data:
CRUD for videos, groups, idols, albums
Import endpoints (YouTube URL, external profile URL, CSV)
PostgreSQL stores all structured K-pop data and links songs to groups / idols.
Keycloak manages authentication and issues tokens used by the SPA and API.


2. Frontend (React)
2.1 Pages & Navigation
Home
Embedded YouTube player (current track)
“Coming up next” queue
Featured idol card (random idol from DB)
Groups
Grid of all K-pop groups (name + debut date)
Idols
Grid of idols joined with group and position
My Page
Placeholder for user-specific features
Admin Videos
Left: existing songs list with search, A-Z filter, group tags
Right: video form with YouTube URL import, metadata editing, save / delete
Import Data
Import from URL: group + idols + albums form
Import from CSV: file upload UI (backend parsing later)
The sidebar is shared across pages and shows an Admin section only for logged-in users.
2.2 State & Data Flow
Components use Axios to call the Express API for:
Loading groups / idols / videos
Saving edited metadata
Importing from YouTube or KProfiles URLs
The YouTube player uses the IFrame Player API to control playback and react to onStateChange events (next track logic).

3. Backend (Node.js + Express)
3.1 Core Responsibilities
REST API for:
/videos (list, search, create, update, delete)
/groups, /idols, /albums
/import/video-from-url
/import/group-from-url
/import/from-csv (planned)
Scraping / external fetch
Fetch HTML from KProfiles or other sources on the server side
Parse group / member information into a structured JSON payload
YouTube integration
Extract video ID from URL
Optional: call YouTube Data API for richer metadata (views, duration, etc.)

3.2 Auth integration
Validates Keycloak access tokens on protected routes.
Future: role-based middleware (requireAdmin) to guard admin-only endpoints.
4. Database (PostgreSQL)
Core tables (simplified):
groups
id, name, korean_name, debut_date, company, gender, fanclub_name, members_count, original_members
idols
id, name, group_id, position, extra_notes
albums
id, title, group_id, release_date, store_url (for future sales module)
videos
id, youtube_id, title, group_id, thumbnail_url, category, tags, mood, style, era, duration, views, likes, publish_date
Relationships:
One group has many idols and many albums.
One group has many videos.
Videos can be used to build playlists and “starter packs” on the frontend.
5. Authentication (Keycloak)
The React app is registered as a public client in a Keycloak realm.
Medium
+1
Login is handled by Keycloak; the SPA receives an access token and ID token.
The token is attached as Authorization: Bearer <token> when calling the Express API.
Current state:
Login / logout work.
Future work: registration, roles (USER, ADMIN), route guards and RBAC on backend.
6. Data Import Flows
6.1 Video Import Flow
Admin pastes a YouTube URL in Admin Videos.
Frontend sends the URL to /import/video-from-url.
Backend:
Extracts the video ID.
Fetches metadata (via YouTube API or scraping).
Returns a structured object to the client.
Form is auto-filled; admin can tweak fields.
“Save video” sends final payload to /videos to persist in PostgreSQL.
6.2 Group / Idol / Album Import Flow
Admin pastes a group profile URL (e.g. KProfiles).
Backend scrapes structured group and member information.
React form under Import Data is auto-filled:
Group metadata
Idol list
Album list (when available)
Admin edits or adds rows manually.
“Save to Database” writes:
1 group row
N idol rows
M album rows
7. Future Extensions
Planned next steps on top of this architecture:
Playlist and queue management stored in DB or user session.
Role-based access control for admin routes.
Image upload + album store section (external purchase links).
Personalised “My Page” (favourites, custom starter packs).
Basic analytics dashboards (popular groups / songs).