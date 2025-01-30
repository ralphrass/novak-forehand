// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from '@/data/users'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Procura o usuário e verifica a senha
        const user = users.find(user => 
          user.email === credentials.email && 
          user.password === credentials.password && 
          user.active
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role
        }
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Se a URL começar com o baseUrl, use-a
      if (url.startsWith(baseUrl)) return url
      // Caso contrário, redirecione para o baseUrl
      return baseUrl
    },
  }
})

export { handler as GET, handler as POST }