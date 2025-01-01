// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        cpf?: string; // Adiciona o CPF ao tipo User
        crefito?: string;
        profissao?: string;
    }
    interface Session {
        user: User;
    }
}
