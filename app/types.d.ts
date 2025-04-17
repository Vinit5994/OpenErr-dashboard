// types.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
  // Add this to a types.d.ts file in your project root
import { ReadonlyRequestCookies } from 'next/dist/server/app-render';
declare module 'next/headers' {
  function cookies(): ReadonlyRequestCookies;
}