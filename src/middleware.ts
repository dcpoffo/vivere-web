import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
    console.log("Middleware executado, mas sem restrições.");
    console.log("--- LOGS ---");
    console.log("Método:", request.method);
    console.log("URL:", request.url);

    return NextResponse.next(); // Sempre permite o acesso
};

const callbackOptions: NextAuthMiddlewareOptions = {
    pages: {
        signIn: "/login", // Pode ser mantido para futuras configurações
    },
};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: "/:path*", // Middleware executa para todas as rotas
};
