import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        //buscar o email do usuario na api
        const url = 'https://vivere-web-backend.vercel.app/usuario?email='
        //const url = 'http://localhost:3333/usuario?email='

        const response = await fetch(`${url}${credentials?.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`${credentials?.email} não encontrado`);
        }

        const usuario = await response.json();

        console.log(usuario)

        const isValidPassword = usuario.password === credentials?.password

        if (!isValidPassword) {
          return null
        }

        return usuario
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      const customUser = user as unknown as any

      if (user) {
        return {
          ...token,
          role: customUser.role
        }
      }

      return token
    },

    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role
        }
      }
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        session: undefined, // O cookie é removido ao fechar o navegador
      },
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }