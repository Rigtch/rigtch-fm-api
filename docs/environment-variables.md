# Environment Variables

predefined `.env` file is available on
_#readme/rigtch-fm-api_ channel on rigtch discord server.

## Spotify Application Variables

- `SPOTIFY_CLIENT_ID` - The Spotify's application client id.
- `SPOTIFY_CLIENT_SECRET` = The Spotify's application client secret.
- `SPOTIFY_REDIRECT_URI` = The uri for authentication callback.

```bash
SPOTIFY_CLIENT_ID="*****"
SPOTIFY_CLIENT_SECRET="*****"
SPOTIFY_REDIRECT_URI="http://localhost:4000/auth/callback"
```

## Spotify API Variables

- `SPOTIFY_BASE_URL` - The base url for Spotify's API.
- `SPOTIFY_ACCOUNTS_URL` - The url for Spotify's accounts API.

```bash
SPOTIFY_BASE_URL="https://api.spotify.com/v1"
SPOTIFY_ACCOUNTS_URL="https://accounts.spotify.com"
```

## Client Authentication Variables

- `CLIENT_CALLBACK_URL` - The url for the client's authentication callback.

```bash
CLIENT_CALLBACK_URL="http://localhost:3000"
```

## Validators Variables

- `ENABLE_TRACKS_VALIDATOR` - If true every track in database will be validated
  before running the application.

```bash
ENABLE_TRACKS_VALIDATOR=false
```

## History Module Variables

- `HISTORY_FETCHING_INTERVAL` - The interval for user's listening history synchronization.
- `HISTORY_FETCHING_DELAY` - The delay between user's history synchronization.

```bash
HISTORY_FETCHING_INTERVAL="1h"
HISTORY_FETCHING_DELAY="2m"
```

## Database Variables

- `DATABASE_HOST` - The host for the database.
- `DATABASE_PORT` - The port for the database.
- `DATABASE_USERNAME` - The username for the database user.
- `DATABASE_PASSWORD` - The password for the database user.
- `DATABASE_NAME` - The name of the database.

```bash
DATABASE_HOST="localhost"
DATABASE_PORT=5432
DATABASE_USERNAME="postgres"
DATABASE_PASSWORD="postgres"
DATABASE_NAME="rigtch-fm-db"
```
