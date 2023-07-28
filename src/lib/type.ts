import type { DotenvConfigOptions } from 'dotenv';

export type SchemaValue =
  | { required: true; default?: never }
  | { default: any; required?: never };

export type Schema = {
  [key: string]: SchemaValue;
};

export type Config = {
  message?: {
    missingEnv?: string;
    missingRequiredVar?: string;
  };
} & DotenvConfigOptions;

export type SchemaKey<T> = keyof T;
