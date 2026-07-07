declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: string;

      DATABASE_URL: string;
      REDIS_URL: string;

      EMAIL_ID: string;
      EMAIL_PASSWORD: string;

      JWT_SECRET_KEY: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;
    }
  }
}

export {};
