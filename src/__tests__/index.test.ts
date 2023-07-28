import path from 'path';
import { describe, test, expect } from 'vitest';

import { Config, Schema, loadEnv } from '..';

const config: Config = {
  path: path.join(__dirname, '.env.test'),
  message: {
    notFound: (key: string) =>
      `Variable '${key}' not definded in env schema and env file`,
    missingRequired: (key: string) => `Missing required env variable '${key}'`,
  },
};

/**
 * NE_ = Non Existing, testing prefix only for better readability
 */
const NON_EXISTING_VARS = {
  NE_TEST: { default: 'test' },
  NE_BOOL: { required: true },
} satisfies Schema;

const EXISTING_VARS = {
  NODE_ENV: { required: true },
  NUM: { default: 123 },
  STR: { default: 'abc' },
  HAS_QUOTES: { default: false },
} satisfies Schema;

const schema = {
  ...EXISTING_VARS,
  ...NON_EXISTING_VARS,
} satisfies Schema;

const { env, getEnv } = loadEnv(schema, config);

describe('loadEnv()', () => {
  test('should return env object and getEnv method', () => {
    expect(env).toBeInstanceOf(Object);
    expect(getEnv).toBeInstanceOf(Function);
  });
});

describe('env {}', () => {
  test('should have parsed env object', () => {
    expect(env.parsed).toBeInstanceOf(Object);
  });
});

describe('getEnv()', () => {
  test('should return correct string value of the existing env variable', () => {
    for (const key of Object.keys(EXISTING_VARS)) {
      const value = getEnv(key as keyof typeof schema);
      expect(value).toBe(env.parsed?.[key]);
      expect(value).toBeTypeOf('string');
    }
  });

  test(`should return default value if the env variable doesn't exist`, () => {
    expect(getEnv('NE_TEST')).toBe(schema.NE_TEST.default);
  });

  test(`should throw missing required error for non existing variable if they are required`, () => {
    expect(() => getEnv('NE_BOOL')).toThrowError(
      config.message?.missingRequired?.('NE_BOOL')
    );
  });

  test(`should throw missing error for non existing (random) variables not included in schema`, () => {
    // @ts-expect-error
    expect(() => getEnv('RANDOM')).toThrowError(
      config.message?.notFound?.('RANDOM')
    );
    // @ts-expect-error
    expect(() => getEnv('RANDOM1')).toThrowError(
      config.message?.notFound?.('RANDOM1')
    );
    // @ts-expect-error
    expect(() => getEnv('RANDOM2')).toThrowError(
      config.message?.notFound?.('RANDOM2')
    );
  });
});
