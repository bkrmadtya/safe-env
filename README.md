# safe-env

A thin [typescript](https://www.typescriptlang.org/) wrapper around [dotenv](https://github.com/motdotla/dotenv). Making it safe, easy and verbose to load and use environment variables.

- [Install](#install)
- [Configuration](#configuration-optional)
- [Schema](#schema)
- [Usage](#usage)

## Install

```bash
npm install @bkrmadtya/safe-env
# or
pnpm add @bkrmadtya/safe-env
# or
yarn add @bkrmadtya/safe-env
```

## Configuration (optional)

The configuration object is optional. It takes all the same options as [dotenv](https://github.com/motdotla/dotenv)'s `config` function along with an additional `message` object with `notFound` and `missingRequired` methods which can be used to customize the error messages.

```typescript
import { type Config, loadEnv } from '@bkrmadtya/safe-env';

const config: Config = {
  path: '/path/to/.env',
  ...allDotenvConfigOptions,
  message: {
    notFound: (key: string) =>
      `Variable '${key}' not definded in env schema and env file`,
    missingRequired: (key: string) => `Missing required env variable '${key}'`,
  },
};
```

## Schema

The schema object is used to define the environment variables expected in the application. A default value can be provided for optional variables or a required flag can be passed for variables that are expected to be present in `.env` file. The same key cannot have both a default value and a required flag.

Incase, a required variable is not found in the `.env` file or a random key not present in the schema is provided, an error is thrown with a default or a custom message.

Let's take following `.env` file as an example:

```dosini
NODE_ENV=production
```

The schema object for the above `.env` file can be defined as follows:

```typescript
const schema = {
  NODE_ENV: { default: 'development' }, // exists in .env
  NAME: { default: 'Ven' }, // doesn't exists
  TEST: { required: true }, // doesn't exist
} satisfies Schema; // 'satisfies' recommended as it provides better ts intellisense
```

## Usage

Recommended usage is to create a `env.ts` file in the root of your project which can act as a single source of truth for all your environment variables.

```typescript
import { loadEnv, type Config, type Schema } from '@bkrmadtya/safe-env';

const config: Config = {
  path: '/path/to/.env',
};

const schema = {
  NODE_ENV: { default: 'development' }, // exists in .env with value 'production'
  NAME: { default: 'Ven' }, // doesn't exists
  TEST: { required: true }, // doesn't exist
} satisfies Schema;

const { getEnv } = loadEnv(schema, config);

// returns production
export const NODE_ENV = getEnv('NODE_ENV');

// returns 'Ven'
export const NAME = getEnv('NAME');

// throws error since its required
export const TEST = getEnv('TEST');

// shows ts compile error and throws error at runtime since it doesn't exist in schema
export const RANDOM = getEnv('RANDOM');
```

### `env` object

The `env` object from the response `dotenv.config()` is also returned by the `loadEnv` function.

```typescript
import { loadEnv } from '@bkrmadtya/safe-env';

const schema = { ... };

const { env } = loadEnv(schema);

// Do something with env
```

## License

MIT © [bkrmadtya 2023](https://github.com/bkrmadtya)
