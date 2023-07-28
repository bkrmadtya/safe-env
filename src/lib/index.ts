import * as dotenv from 'dotenv';

type SchemaValue =
  | { required: true; default?: never }
  | { default: any; required?: never };

type EnvSchema = {
  [key: string]: SchemaValue;
};

type EnvConfig = {
  message?: {
    missingEnv?: string;
    missingRequiredVar?: string;
  };
} & dotenv.DotenvConfigOptions;

type SchemaKey<T> = keyof T;

export const loadEnv = <T extends EnvSchema>(
  schema: T,
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

  type Key = SchemaKey<typeof schema>;
  type AllKeys = Partial<Record<Key, string>>;

  return {
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
    env,
    getAllEnv: (): AllKeys => env.parsed! as AllKeys,
  };
};
