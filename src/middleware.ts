import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";
import debug from "debug";

// Configure os namespaces para logs
const logMiddleware = debug("app:middleware");
const logAuth = debug("app:auth");

const middleware = (request: NextRequestWithAuth) => {
    logMiddleware("ENTRANDO NO middleware");

    if (!request.nextauth.token) {
        logMiddleware("Parece que não tem token!!!");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const token = request.nextauth.token || {};
    const isAdminUser = token.role === "admin";

    if (!isAdminUser) {
        logMiddleware("Usuário não autorizado, redirecionando para /denied");
        return NextResponse.rewrite(new URL("/denied", request.url));
    }

    logMiddleware("--- MIDDLEWARE LOG ---");
    logMiddleware("Método: %s", request.method);
    logMiddleware("URL: %s", request.url);
    logMiddleware("Cabeçalhos: %O", [ ...request.headers ]); // %O para objetos
    logMiddleware("Token: %O", request.nextauth.token);

    return NextResponse.next();
};

const callbackOptions: NextAuthMiddlewareOptions = {
    pages: {
        signIn: "/login", // Redirecionar para /login caso o token seja inválido
    },
    callbacks: {
        authorized: ({ token }) => {
            logAuth("Verificando autorização no callback...");
            const isAuthorized = !!token;
            logAuth("Token presente: %s", isAuthorized);
            return isAuthorized;
        },
    },
};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: "/private/:path*",
};
