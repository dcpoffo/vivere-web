"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { usePacienteContext } from "@/context/PacienteContext";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession(); // Obtém a sessão client-side
    const { pacienteSelecionado } = usePacienteContext();

    return (
        <main className="min-h-screen flex flex-col bg-slate-300">
            {/* {pacienteSelecionado && <Navegacao />} */}
            {/* {pacienteSelecionado && <Header />} */}
            {pacienteSelecionado && <Sidebar />}
            <div className="flex-grow overflow-auto flex justify-center items-center pt-10">
                {children}
            </div>
            {/* <Footer /> */}
        </main>
    );
}
