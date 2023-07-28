import * as dotenv from 'dotenv';

import { Config, Schema, SchemaKey, SchemaValue } from './utils/type';

export type { Config, Schema, SchemaKey, SchemaValue };

export const loadEnv = <T extends Schema>(
  schema: T,
  config: Config = { path: '.env' }
) => {
  const {
    message = {
      notFound: (key: string) =>
        `Variable '${key}' not definded in env schema and env file`,
      missingRequired: (key: string) =>
        `Missing required env variable '${key}'`,
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

      if (!option && !value) throw new Error(message?.notFound?.(key));

      if ('required' in option && option.required && !value)
        throw new Error(message?.missingRequired?.(key));

      return value || ('default' in option ? option.default : undefined);
    },
  };
};
