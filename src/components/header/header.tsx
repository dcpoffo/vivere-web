"use client";

import Link from "next/link";
import React from "react";
import { SignOutButton } from "../signOutButton";
import { signOut, useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePacienteContext } from "@/context/PacienteContext";
import { Search, X } from "lucide-react";

export function Header() {
    const { data: session } = useSession(); // Usa `useSession` no client-side
    const { pacienteSelecionado } = usePacienteContext();

    return (
        <header className="fixed w-full h-16 flex items-center bg-slate-400 text-slate-900 px-4">
            {/* Centro do header */}
            <div className="flex w-full justify-center items-center space-x-2">
                {pacienteSelecionado ? (
                    <p className="text-black-500">Paciente: {pacienteSelecionado.nome}</p>
                ) : (
                    <p className="text-red-500">Nenhum paciente selecionado.</p>
                )}
                <Link href="/private/pacientes">
                    <Button
                        type="button"
                        className="px-4 py-2 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-500 flex items-center justify-center"
                    >
                        <Search size={16} />
                    </Button>
                </Link>
            </div>

            {/* Botão de sair */}
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="absolute right-4 flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-500"
            >
                <X size={20} /> Sair
            </button>
        </header>

    );
}
