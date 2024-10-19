import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        //buscar o email do usuario na api
        const user = {
          id: '1',
          email: 'dcpoffo@gmail.com', //credentials.email
          password: '123',
          name: 'Darlan Radamés Conte Poffo',
          role: 'admin'
        }

        const isValidEmail = user.email === credentials?.email
        const isValidPassword = user.password === credentials?.password

        if (!isValidEmail || !isValidPassword) {
          return null
        }

        return user
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user}) => {
      const customUser = user as unknown as any

      if (user) {
        return {
          ...token,
          role: customUser.role
        }
      }

      return token
    },
    
    session: async ({session, token}) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role
        }
      }
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }