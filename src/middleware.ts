import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
    console.log("ENTRANDO NO middleware");

    const token = request.nextauth.token || null;

    if (!token) {
        console.log("Token ausente ou inválido!");
        return NextResponse.redirect(new URL("/denied", request.url));
        // return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdminUser = token.role === "admin";

    if (!isAdminUser) {
        console.log("Usuário não é administrador!");
        return NextResponse.rewrite(new URL("/denied", request.url));
    }

    console.log("--- MIDDLEWARE LOG ---");
    console.log("Método:", request.method);
    console.log("URL:", request.url);
    console.log("Token:", token);

    return NextResponse.next();
};

const callbackOptions: NextAuthMiddlewareOptions = {
    pages: {
        signIn: "/login", // Página de login
    },
    callbacks: {
        authorized: ({ token }) => {
            // Permitir acesso somente se o token existir
            console.log("Executando callback 'authorized'");
            return !!token;
        },
    },
};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: "/:path*", // Middleware será executado para todas as rotas
};
