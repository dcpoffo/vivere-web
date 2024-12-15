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
        //const url = `http://localhost:3333/usuario?email=${credentials?.email}`;
        const url = `https://vivere-web-backend.vercel.app/usuario?email=${credentials?.email}`;
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
})

const config = {
    providers: [ Google, credentialsConfig ],
    pages: {
        signIn: "/login",
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)