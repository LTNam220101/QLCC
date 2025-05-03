import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60 // 1 H
  },
  providers: []
}
