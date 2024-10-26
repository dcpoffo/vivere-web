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

        const response = await fetch(`http://localhost:3333/usuario?email=${credentials?.email}`, {
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

        // const user = {
        //   id: '1',
        //   email: 'dcpoffo@gmail.com', //credentials.email
        //   password: '123',
        //   name: 'Darlan Radamés Conte Poffo',
        //   role: 'admin'
        // }

        //const isValidEmail = user.email === credentials?.email

        // if (!isValidEmail || !isValidPassword) {

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
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }