# Project Setup

## Installation

Make sure that you have the right version of Node.js installed in nvm.

```bash
nvm use
```

Make sure you have bun installed globally.

```bash
#Linux & macOS
curl -fsSL https://bun.sh/install | bash

#Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

I'm suggesting to install
[@antfu/ni](https://www.npmjs.com/package/@antfu/ni/v/0.13.1) globally:

```bash
bun add  -g @antfu/ni
```

Don't forget to install the dependencies:

```bash
ni
```

## Running the app

### With Docker in isolated environment

First of all make sure you have Docker daemon installed and running.

Fill up the [Database Environment Variables](environment-variables.md#database-variables).

Building the docker container:

```bash
nr docker:build
```

### With external database

Fill up the [Database Environment Variables](environment-variables.md#database-variables)
with development database provided on discord channel _#readme_.

Run command:

```bash
nr start:dev
```

## Linting the app

Running eslint:

```bash
nr lint
```

And with fix option enabled:

```bash
nr lint:fix
```

## Testing the app

Running unit tests:

```bash
nr test
```

In watch mode:

```bash
nr test:watch
```

And with collecting coverage:

```bash
nr test:coverage
```
