"use client";

import Link from "next/link";
import React, { useState } from "react";
import { X, Users, FileText, Camera, DollarSign, File, Activity, Crosshair, MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePacienteContext } from "@/context/PacienteContext";

export function Sidebar() {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleCloseSidebar = () => {
        setIsOpen(false);
    };

    const { pacienteSelecionado } = usePacienteContext();

    const isItemDisabled = (path: string) => {
        // Apenas "Home" e "Pacientes" ficam habilitados se nenhum paciente estiver selecionado
        if (!pacienteSelecionado) {
            return path !== "/" && path !== "/private/pacientes";
        }
        return false;
    };

    return (
        <>
            {/* Botão de abrir a Sidebar */}
            {!isOpen && (
                <button
                    onClick={handleToggleSidebar}
                    className="fixed top-4 left-4 bg-blue-600 text-white p-2 rounded-md z-50 hover:bg-blue-500"
                >
                    <MenuIcon size={20} />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-slate-400 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 z-40`}
            >
                {/* Botão de fechar */}
                <button
                    onClick={handleCloseSidebar}
                    className="absolute top-4 right-4 bg-red-600 text-white p-1 rounded-full hover:bg-red-500 border border-red-700"
                >
                    <X size={20} />
                </button>

                {/* Itens da Sidebar */}
                <nav className="flex flex-col gap-4 p-6 mt-10">
                    {[
                        { label: "Home", icon: Users, path: "/" },
                        { label: "Cadastro", icon: Users, path: `/private/pacientes/edit/${pacienteSelecionado?.id}` },
                        { label: "Ficha de Avaliações", icon: FileText, path: "/private/avaliacoes" },
                        { label: "Fotos de Acompanhamento", icon: Camera, path: "/private/fotos" },
                        { label: "Mensalidades", icon: DollarSign, path: "/private/mensalidades" },
                        { label: "Exames Complementares", icon: File, path: "/private/exames" },
                        { label: "Atendimentos", icon: Activity, path: "/private/atendimentos" },
                        { label: "Osteopatia", icon: Crosshair, path: "/private/osteopatia" },
                    ].map(({ label, icon: Icon, path }) => (
                        <Link
                            key={path}
                            href={isItemDisabled(path) ? "#" : path}
                            onClick={isItemDisabled(path) ? undefined : handleCloseSidebar}
                        >
                            <div
                                className={`flex items-center gap-3 p-2 rounded-md ${isItemDisabled(path) ? "bg-gray-300 cursor-not-allowed" : "bg-slate-400 hover:bg-slate-500"
                                    }`}
                            >
                                <Icon size={20} />
                                {label}
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* Botão de sair */}
                <div className="absolute bottom-4 left-0 w-full px-6">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                    >
                        <X size={20} /> Sair
                    </button>
                </div>
            </div>
        </>
    );
}
