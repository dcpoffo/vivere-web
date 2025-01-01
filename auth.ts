import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const credentialsConfig = CredentialsProvider({
    name: "Credentials",
    credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseURL}/usuario?email=${credentials?.email}`;

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

        // Retorne o usuário autenticado
        return {
            id: usuario.id,
            name: usuario.name, // Use o nome correto da propriedade
            email: usuario.email,
            role: usuario.role, // Exemplo: cargo ou tipo de usuário
            cpf: usuario.cpf,
            crefito: usuario.crefito,
            profissao: usuario.profissao,
        };
    },
});

const config = {
    providers: [ Google, credentialsConfig ],
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: undefined,
                expires: undefined,
            },
        },
    },
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                const customUser = user as any;
                return {
                    ...token,
                    role: customUser.role,
                    cpf: customUser.cpf as string | undefined,
                    crefito: customUser.crefito as string | undefined,
                    profissao: customUser.profissao as string | undefined,
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
                    cpf: token.cpf as string | undefined,
                    crefito: token.crefito as string | undefined,
                    profissao: token.profissao as string | undefined,
                },
            };
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
