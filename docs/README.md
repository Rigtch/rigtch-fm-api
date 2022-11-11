# Rigtch Music Api

## Configuration

### Installation

```bash
yarn
```

### Running the app

```bash
# development
yarn start:dev {microserviceName}

# debug mode
yarn start:debug {microserviceName}

# build
yarn build {microserviceName}

# run docker first time
yarn docker:build

# run docker
yarn docker:dev
```

### Linting app

```bash
yarn lint

# with fix
yarn lint:fix
```

### Testing

#### Unit tests

```bash
yarn test

# watch mode
yarn test:watch

# debug mode
yarn test:debug

# code coverage
yarn test:cov
```

#### E2E tests

```bash
yarn test:e2e

# watch mode
yarn test:e2e:watch
```

#### Mutation tests

```bash
yarn stryker
```

### Environment

Environment variables for every microservice are located in
`apps/{microserviceName}/.example.env` file.

All environment files are avaible on Discord server in private channel `music-api`.

## Working with project

### Creating issues

Fill issue title (what is the problem or requested feature).
Optionally fill description and descript the problem or feature.

Add labels
fe. If issue is new request for feature, add label `enhancement`.
Add label with status fe. `in::todo`

Link Project (Rigtch Music) and set status fe. `To Do`.

### Creating pull requests

Create branch from choosen issue. fe. `3-create-spotify-authentication`

Fill pull request title (what is the problem or requested feature)
branch name is accepted.
Optionally fill description and descript the problem or feature.

Link issue to pull request.
Update issue status to `in::progress` or `in::review`.

Wait for review.

## GraphQL Queries and Endpoints

### Auth Microservice

#### Endpoints

`/auth/spotify/login`

Redirecting to spotify login page.
After successful authentication redirect to `/auth/spotify/callback` endpoint.

Returns:

`SpotifyAuth`

#### GraphQL Queries

- `refresh`

Requires Authentication Basic as authorization header.

Returns:

`RefreshResponse`

- `profile`

Requires Authentication Bearer as authorization header.

Returns:

`ProfileDto`

### Statistics Microservice

#### GraphQL Queries

- `lastTracks`

Requires Authentication Bearer as authorization header.

Accepts:
`limit` - number of tracks to Return
[type: `Float`, default: `20`, max: `50`]

Returns:

`Track[]`

- `topTracks`

Requires Authentication Bearer as authorization header.

Accepts:
`limit` - number of tracks to Return
[type: `Float`, default: `20`, max: `50`]

Returns:

`Track[]`

- `topArtists`

Requires Authentication Bearer as authorization header.

Accepts:
`limit` - number of tracks to Return
[type: `Float`, default: `20`, max: `50`]

Returns:

`Artist[]`

### Player Microservice

#### GraphQL Queries

- `avaibleDevices`

Requires Authentication Bearer as authorization header.

Returns:

`Device[]`

- `pausePlayer`

Requires Authentication Bearer as authorization header.

Accepts:

`afterTime` - time in seconds after which the player will pause
[type: `Float`, default: `0`]

`deviceId` - id of device to pause
[type: `String`, default: `undefined` but auto getting currently playing device)]

Returns:

`Success`

### Dtos and ObjectTypes

#### Dtos

- `SpotityAuth`

```ts
abstract class SpotifyAuth {
  user: Profile
  authInfo: AuthInfo
}
```

- `AuthInfo`

```ts
abstract class AuthInfo {
  accessToken: string
  refreshToken: string
  expiresIn: number
}
```

#### ObjectTypes

- `RefreshResponse`

```graphql
type RefreshResponse {
  accessToken: String!
  refreshToken: String
  expiresIn: Float!
}
```

- `ProfileDto`

```graphql
type ProfileDto {
  id: String!
  displayName: String!
  images: [ImageDto!]!
  followers: Float!
  country: String
  email: String
  uri: String!
}
```

- `Track`

```graphql
type Track {
  name: String!
  href: String!
  artists: [String!]!
  album: Album!
}
```

- `Artist`

```graphql
type Artist {
  name: String!
  genres: [String!]!
  href: String!
  images: [ImageDto!]!
}
```

- `Album`

```graphql
type Album {
  name: String!
  artist: String!
  images: [ImageDto!]!
}
```

- `ImageDto`

```graphql
type ImageDto {
  height: Float!
  width: Float!
  url: String!
}
```

- `Device`

```graphql
type Device {
  id: String!
  name: String!
  type: String!
  isActive: Boolean!
  isPrivateSession: Boolean!
  isRestricted: Boolean!
  volumePercent: Float!
}
```

- `Success`

```graphql
type Success {
  success: Boolean!
  message: String
}
```
