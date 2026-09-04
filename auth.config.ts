import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isAdmin = auth?.user?.role === "ADMIN";
      const onAdmin = nextUrl.pathname.startsWith("/admin");
      const onCompte = nextUrl.pathname.startsWith("/compte");

      if (onAdmin) return isAdmin;
      if (onCompte) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CLIENT" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
