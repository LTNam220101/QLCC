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
const refreshAccessToken = async (token: any) => {
  try {
    // Gọi API refresh token của bạn
    const response = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.user?.refreshToken}`
      }
    })
    const refreshedTokens = await response.json()
    return {
      ...token,
      user: {
        ...token.user,
        token: refreshedTokens?.data?.token || token.user.token,
        refreshToken:
          refreshedTokens?.data?.refreshToken || token.user.refreshToken
      }
    }
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
      if (!isTokenExpired(token?.user?.token)) {
        return token
      }

      // Token hết hạn, thực hiện refresh
      return refreshAccessToken(token)
    },
    session: async ({ session, token }) => {
      // Kiểm tra nếu có lỗi refresh token
      if (token.error === "RefreshTokenError") {
        // Có thể xử lý đăng xuất tại đây nếu cần
        return { ...session, error: token.error }
      }
      // Cập nhật thông tin user trong session
      ;(session.user as IUser) = token.user
      return session
    }
  },
  jwt: {
    maxAge: 1800
  }
})
