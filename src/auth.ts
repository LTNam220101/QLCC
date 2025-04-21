import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendRequest } from "../utils/api";
import { ILogin } from "../types/auth";
import { IUser } from "../types/next-auth";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Account",
      async authorize(credentials) {
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `/auth/login`,
          body: {
            ...credentials,
          },
        });
        if (res.status === "error" && +res?.error === 400) {
          throw new Error("User not found");
        } else if (res.status === "error" && +res?.error === 503) {
          throw new Error("Internal server error");
        }
        return res.data;
      },
      credentials: {
        username: {},
        password: {},
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // signOut: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
  },
});
