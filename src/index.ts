import * as dotenv from 'dotenv';

import { Config, Schema, SchemaKey, SchemaValue } from './utils/type';

export type { Config, Schema, SchemaKey, SchemaValue };

export const loadEnv = <T extends Schema>(
  schema: T,
  config: Config = { path: '.env' }
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

  type Key = SchemaKey<typeof schema>;

  return {
    env,
    getEnv: (keyStr: Key): string => {
      const key = keyStr as string;
      const value = env?.parsed?.[key];
      const option = schema[key as Key] as SchemaValue;

      if (!option && !value)
        throw new Error(`${message?.missingEnv}: '${key}'`);

      if ('required' in option && option.required && !value)
        throw new Error(`${message?.missingRequiredVar}: '${key}'`);

      return value || ('default' in option ? option.default : undefined);
    },
  };
};
