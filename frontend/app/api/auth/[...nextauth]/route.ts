import { axiosInstance } from "@/utils/request";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const form = new URLSearchParams();
        form.append("username", credentials?.username as string);
        form.append("password", credentials?.password as string);
        const res = await axiosInstance.post("/auth/token/", credentials, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        const user = await res.data;

        if (res.status == 200 && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
