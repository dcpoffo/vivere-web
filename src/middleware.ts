import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
    console.log("[MIDDLEWARE]: Iniciando validação de rota.");
    console.log("[MIDDLEWARE_NEXTAUTH_TOKEN]:", request.nextauth.token);

    const isPrivateRoutes = request.nextUrl.pathname.startsWith("/private");
    console.log("Middleware: Private route accessed:", isPrivateRoutes);

    if (!request.nextauth.token) {
        console.log("[MIDDLEWARE]: Token não encontrado. Redirecionando ao login.");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdminUser = request.nextauth.token.role === "admin";
    console.log("Middleware: Usuário é admin?", isAdminUser);

    if (isPrivateRoutes && !isAdminUser) {
        console.log("[MIDDLEWARE]: Acesso negado para usuário não-admin.");
        return NextResponse.rewrite(new URL("/denied", request.url));
    }

    console.log("[MIDDLEWARE]: Acesso autorizado.");
    return NextResponse.next();
};


const callbackOptions: NextAuthMiddlewareOptions = {
    // Qualquer configuração adicional para o middleware
};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: "/private/:path*",
};

