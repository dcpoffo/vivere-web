"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession(); // Obtém a sessão client-side

    return (
        <main className="min-h-screen flex flex-col bg-slate-300">
            {/* {session && <Header />} Exibe o Header se a sessão existir */}
            <div className="flex-grow overflow-auto flex justify-center items-center">
                {children}
            </div>
            {/* <Footer /> */}
        </main>
    );
}
