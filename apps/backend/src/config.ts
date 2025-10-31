import dotenv from 'dotenv';

dotenv.config();

/**
 * Add and remove config that you need.
 */
export const config = {
  env: process.env.ENVIRONMENT || 'production',
  port: +(process.env.PORT || 8000),
  // @FIXME: config helper types as any - cors middleware fails to compile
  corsWhiteList: (process.env.CORS_WHITELIST || '*') as string,
  jwtAccessSecret: 'no',
  apiKey: process.env.API_KEY || false,
  requestWorker: {
    processes: 0,
    threadsPerProcess: 0,
    timeoutMs: 0,
    silent: true,
  },
};
export type Config = typeof config;

export default config;
