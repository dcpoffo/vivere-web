import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {

    const isPrivateRoutes = request.nextUrl.pathname.startsWith("/private");

    if (!request.nextauth.token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdminUser = request.nextauth.token.role === "admin";

    if (isPrivateRoutes && !isAdminUser) {
        return NextResponse.rewrite(new URL("/denied", request.url));
    }

    const token = request.nextauth.token;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log('--- MIDDLEWARE LOG ---');
    console.log('Método:', request.method);
    console.log('URL:', request.url);
    console.log('Cabeçalhos:', [ ...request.headers ]);


    return NextResponse.next();
};


const callbackOptions: NextAuthMiddlewareOptions = {
    // Qualquer configuração adicional para o middleware
    pages: {
        signIn: "/login", // Redirecionar para /login caso o token seja inválido
    },
    callbacks: {
        authorized: ({ token }) => {
            // Permitir acesso somente se o token existir
            return !!token;
        },
    },
};


export default withAuth(middleware, callbackOptions);



export const config = {
    matcher: "/private/:path*",
};

