// src/utils/env.ts

/**
 * Centralized access and validation for environment variables.
 * Throws an error if a required environment variable is not defined.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_REMOTE_API_BASE_URL;
export const ORIGIN_URL = process.env.NEXT_PUBLIC_ORIGIN_URL;

if (!API_BASE_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_REMOTE_API_BASE_URL is not defined.");
}

if (!ORIGIN_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_ORIGIN_URL is not defined.");
}
