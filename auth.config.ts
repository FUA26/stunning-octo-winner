
import type { NextAuthConfig } from "next-auth"

export default {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/login", // (used for check email message)
  },
  providers: [],
} satisfies NextAuthConfig