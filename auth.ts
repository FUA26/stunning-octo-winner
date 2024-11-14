import NextAuth from "next-auth"
import authConfig from "./auth.config";
import credentials from "next-auth/providers/credentials";
import { Backend_URL } from "./lib/constants";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   providers: [GitHub, Google],
// })



const nextAuth = NextAuth({
    ...authConfigRest,
    providers: [
      ...authConfigProviders,
      credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            // console.log(credentials)
          if (!credentials) {
            throw new Error("Credentials not provided");
          }
          const { email, password } = credentials;
  
          try {
            // console.log("Credentials",credentials)
            const response = await fetch(Backend_URL + "/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const responseData = await response.json(); // Dapatkan data respons dalam format JSON

    console.log("RESPONCE DATA", responseData); // Log seluruh objek respons untuk pemeriksaan

    const user = responseData.user; // Ambil objek pengguna
    const tokens = responseData.backendTokens; // Ambil token akses

    console.log("USER", user); // Log pengguna
    console.log("TOKENS", tokens); // Log token
            if (user) {
              return user.data; // Return user object on successful login
            } else {
              throw new Error("Login failed");
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              throw new Error(`Login failed: ${error.message}`);
            } else {
              throw new Error("Login failed: Unknown error");
            }
          }
        },
      }),
    ],
    callbacks: {
    //   authorized({ auth, request }) {
    //     const { nextUrl } = request;
    //     console.log("ASDASDASD")
    //     // Define public and auth URLs
    //     const publicUrls = ["/about", "/contact"]; // Public routes
    //     const authUrls = ["/login", "/register"]; // Authentication routes
  
    //     const isLoggedIn = !!auth?.user; // Check if the user is logged in
    //     const currentUrl = nextUrl.pathname; // Current URL being accessed
    //     console.log("isLoggedIn",isLoggedIn)
    //     if (publicUrls.includes(currentUrl)) {
    //       return true;
    //     }
  
    //     if (isLoggedIn && authUrls.includes(currentUrl)) {
    //       // console.log("LOGIN LOGED");
    //       return Response.redirect(new URL("/", nextUrl));
    //     }
  
    //     if (!isLoggedIn) {
    //       return false;
    //     }
  
    //     return true;
    //   },
      async jwt({ token, user, trigger, account, session }) {
        // console.log("JWT",{ token, user, trigger,account, session })
  
        if (trigger === "signIn" && account?.type === "credentials") {
          let userData = user.user;
          let tokenData = user.backendTokens;
  
          let token = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            tokenExpires: tokenData.expiresIn,
          };
          try {
            return {
              token,
              user: userData,
            };
          } catch (error) {
            throw new Error("Error setting up session");
          }
        } else if (Date.now() < token.token.tokenExpires) {
          return { ...token };
        } else {
          if (!token.token.refreshToken)
            throw new TypeError("Missing refresh_token");
  
          try {
            let payload = {};
            let headers = {
              "Content-Type": "application/json",
              Authorization: token.token.refreshToken,
            };
  
            let ResponseTokenRefresh = await fetch(Backend_URL + "/api/v1/auth/refresh", {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                "Content-Type": "application/json",
                Authorization: token.token.refreshToken,
              },
            });
  
            if (ResponseTokenRefresh.ok) {
              let data = await ResponseTokenRefresh.json();
  
              let tokenData = {
                ...token.token,
                accessToken: data.accessToken,
                tokenExpires: data.expiresIn,
              };
              return {
                ...token,
                tokenData,
              };
            }
          } catch (error) {
            throw new Error("Token refresh failed");
          }
        }
  
        return token;
      },
      signIn({ user, account, profile }) {
        if (account?.provider === "credentials") {
          return true;
        }
  
        return false;
      },
      session({ session, token }) {
        session.user = token.user;
        session.token = token.token;
        session.expires = new Date(session.token.tokenExpires).toISOString();
        // console.log("session awal", session);
        return session;
      },
    },
  });
  
  export const { signIn, signOut, auth, handlers } = nextAuth;