import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
    console.log("[MIDDLEWARE_NEXTAUTH_TOKEN]:", request.nextauth.token);

    const isPrivateRoutes = request.nextUrl.pathname.startsWith("/private");
    console.log("Middleware: Private route accessed:", isPrivateRoutes);
    const isAdminUser = request.nextauth.token?.role === "admin";

    // Bloqueia acesso a rotas privadas para usuários não autorizados
    if (isPrivateRoutes && (!request.nextauth.token || !isAdminUser)) {
        console.log("[MIDDLEWARE]: Acesso negado");
        //return NextResponse.rewrite(new URL("/denied", request.url));
        return NextResponse.redirect(new URL("/denied", request.url));
    }

    // Permite que a navegação continue
    return NextResponse.next();
};

const callbackOptions: NextAuthMiddlewareOptions = {
    // Qualquer configuração adicional para o middleware
};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: "/private/:path*",
};

