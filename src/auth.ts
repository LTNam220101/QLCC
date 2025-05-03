import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sendRequest } from "../utils/api"
import { ILogin } from "../types/auth"
import { IUser } from "../types/next-auth"
import { jwtDecode } from "jwt-decode"
import { authConfig } from "./auth.config"
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

// Hàm refresh token
const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Gọi API refresh token của bạn
    const response = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`
      }
    })
    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return refreshedTokens
  } catch (error) {
    console.error("Error refreshing token:", error)
    return {
      error: "RefreshAccessTokenError"
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Account",
      async authorize(credentials) {
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `/auth/login`,
          body: {
            ...credentials
          }
        })
        if (res.status === "error" && res?.error && +res?.error === 400) {
          throw new Error("User not found")
        } else if (
          res.status === "error" &&
          res?.error &&
          +res?.error === 503
        ) {
          throw new Error("Internal server error")
        }
        return res.data
      },
      credentials: {
        username: {},
        password: {}
      }
    })
  ],
  pages: {
    signIn: "/login"
    // signOut: "/login",
    // error: "/login"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user as IUser
        return token
      }
      // Kiểm tra token còn hạn không
      if (!isTokenExpired(token.user.token)) {
        return token
      }

      // Token hết hạn, thực hiện refresh
      return refreshAccessToken(token.user?.refreshToken)
    },
    session: async ({ session, token }) => {
      ;(session.user as IUser) = token.user
      return session
    }
  }
})
