# Environment Variables

predefined `.env` file is available on
_#readme/rigtch-fm-api_ channel on rigtch discord server.

## Spotify Application Variables

- `SPOTIFY_CLIENT_ID` - The Spotify's application client id.
- `SPOTIFY_CLIENT_SECRET` = The Spotify's application client secret.

```bash
SPOTIFY_CLIENT_ID="*****"
SPOTIFY_CLIENT_SECRET="*****"
```

## Spotify API Variables

- `SPOTIFY_BASE_URL` - The base url for Spotify's API.
- `SPOTIFY_ACCOUNTS_URL` - The url for Spotify's accounts API.

```bash
SPOTIFY_BASE_URL="https://api.spotify.com/v1"
SPOTIFY_ACCOUNTS_URL="https://accounts.spotify.com"
```

## History Module Variables

- `HISTORY_FETCHING_INTERVAL` - The interval for user's listening history synchronization.
- `ENABLE_HISTORY_SYNCHRONIZATION` - If true the history synchronization will
  be enabled.

```bash
HISTORY_FETCHING_INTERVAL="1h"
ENABLE_HISTORY_SYNCHRONIZATION=false
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

## Redis Variables

- `REDIS_HOST` - The host for the redis server.
- `REDIS_PORT` - The port for the redis server.
- `REDIS_USER` - The username for the redis user(optional).
- `REDIS_PASSWORD` - The password for the redis user(optional).

```bash
REDIS_HOST="localhost"
REDIS_PORT=6379
```
