import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
    console.log("ENTRANDO NO middleware")

    // if (!request.nextauth.token) {
    //     console.log("Parece que não tem token!!!")

    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    const token = request.nextauth.token || {};
    const isAdminUser = token.role === 'admin';

    if (!isAdminUser) {
        return NextResponse.rewrite(new URL("/denied", request.url));
    }


    console.log('--- MIDDLEWARE LOG ---');
    console.log('Método:', request.method);
    console.log('URL:', request.url);
    console.log('Cabeçalhos:', [ ...request.headers ]);
    console.log("Token: ", request.nextauth.token)

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
            console.log("entrou no callbacks")
            return !!token;
        },
    },
};


export default withAuth(middleware, callbackOptions);



export const config = {
    matcher: "/private/:path*",
};

