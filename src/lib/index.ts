import * as dotenv from 'dotenv';

type EnvSchema = {
  [key: string]: { required: true } | { default: any };
};

type EnvConfig = {
  message?: {
    missingEnv?: string;
    missingRequiredVar?: string;
  };
} & dotenv.DotenvConfigOptions;

export const loadEnv = (
  schema: EnvSchema,
  config: EnvConfig = { path: '.env' }
) => {
  const {
    message = {
      missingEnv: 'Variable not definded in env schema and env file',
      missingRequiredVar: 'Missing required env variable',
    },
    ...rest
  } = config;

  const env = dotenv.config(rest);

  if (env.error) throw env.error;

  return {
    getEnv: (key: string): string | undefined => {
      const value = env?.parsed?.[key];
      const option = schema[key];

      if (!option && !value)
        throw new Error(`${message?.missingEnv}: '${key}'`);

      if ('required' in option && option.required && !value)
        throw new Error(`${message?.missingRequiredVar}: '${key}'`);

      return value || ('default' in option ? option.default : undefined);
    },
    env,
    getAllEnv: () => env.parsed,
  };
};

// ------------------------------------------------- USAGE -----------------------------------------------

const config = {
  path: '.env',
  message: {
    missingEnv: 'Variable not found in schema and env file',
    missingRequiredVar: 'Custom missing required env variable',
  },
};

const schema: EnvSchema = {
  TEST: { default: 'A DEFAULT VALUE' },
  SECRET: { default: 1234567890 },
  FLOAT: { default: 0.5 },
  BOOL: { required: true },
};

const { getEnv, getAllEnv } = loadEnv(schema, config);

const allEnv = getAllEnv();
console.log(allEnv);

const TEST = getEnv('TEST');
console.log({ TEST });
const SECRET = getEnv('SECRET');
console.log({ SECRET });
const FLOAT = getEnv('FLOAT');
console.log({ FLOAT });
const BOOL = getEnv('BOOL');
console.log({ BOOL });
const RANDOM = getEnv('RANDOM');
