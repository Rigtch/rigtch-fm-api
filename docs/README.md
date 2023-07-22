# Rigtch Music Api

## Usage

### Setup

Make sure to have installed right version of Node.js in nvm

```bash
nvm use
```

### Installation

Don't forget to install the dependencies:

```bash
yarn install
```

### Running the app

```bash
# development
yarn start:dev

# debug mode
yarn start:debug

# build
yarn build
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

## Endpoints

### Authentication

- `/auth/login`

Redirecting to spotify login page.
After successful authentication redirect to `/auth/callback` endpoint.

- `/auth/callback`

After sucessful redirect from `/login` page,
Redurecting to client callback url with query params:
`accessToken` and `refreshToken`.
