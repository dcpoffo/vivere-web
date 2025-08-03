"use client";

import { usePacienteContext } from "@/context/PacienteContext";
import { X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
    const { data: session } = useSession(); // Usa `useSession` no client-side
    const { pacienteSelecionado } = usePacienteContext();

    return (
        <header className="shadow-md fixed w-full h-16 flex items-center bg-sidebar text-slate-900 px-4">
            {/* Centro do header */}
            <div className="flex w-full justify-center items-center space-x-2">
                {pacienteSelecionado ? (
                    <p
                        className="text-black-500"
                    >
                        Paciente:
                        <Link href="/private/pacientes" className="hover:underline ml-2">
                            {pacienteSelecionado.nome}
                        </Link>
                    </p>
                ) : (
                    // <p className="text-red-500">Nenhum paciente selecionado. Clique para selecionar</p>
                    <p className="text-black">
                        <Link href="/private/pacientes" className="hover:underline">Clique para selecionar o paciente.</Link>
                    </p>
                )}
            </div>

            {/* Botão de sair */}
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="absolute right-4 flex items-center justify-center gap-2 p-2 bg-roxoEscuro text-white rounded-md hover:bg-roxoClaro"
            >
                <X size={20} /> Sair
            </button>
        </header>

    );
}
