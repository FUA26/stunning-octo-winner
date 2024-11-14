import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string | null;
    };
    token: {
      accessToken: string;
      refreshToken: string;
      exp: number;
      iat: number;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      email: string;
      name: string;
      role: string | null;
    };
    token: {
      accessToken: string;
      refreshToken: string;
      exp: number;
      iat: number;
    };
  }
}
