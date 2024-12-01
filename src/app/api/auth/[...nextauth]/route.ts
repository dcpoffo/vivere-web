import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/usuario?email=${credentials?.email}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`${credentials?.email} não encontrado`);
        }

        const usuario = await response.json();

        // Verifique se a senha é válida
        const isValidPassword = usuario.password === credentials?.password; // Substitua por bcrypt se necessário
        if (!isValidPassword) {
          return null;
        }

        return usuario;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const customUser = user as any;
        return {
          ...token,
          role: customUser.role,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role,
        },
      };
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
