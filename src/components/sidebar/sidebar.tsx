"use client";

import Link from "next/link";
import React, { useState } from "react";
import { X, Users, FileText, Camera, DollarSign, File, Activity, Crosshair, MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
    const [ isOpen, setIsOpen ] = useState(false);

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleCloseSidebar = () => {
        setIsOpen(false);
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
                    className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 border border-red-700"
                >
                    <X size={20} />
                </button>

                {/* Itens da Sidebar */}
                <nav className="flex flex-col gap-4 p-6 mt-10">
                    <Link href="/" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <Users size={20} /> Pacientes
                        </div>
                    </Link>
                    <Link href="/private/fichaAvaliacoes" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <FileText size={20} /> Ficha de Avaliações
                        </div>
                    </Link>
                    <Link href="/private/fotos" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <Camera size={20} /> Fotos de Acompanhamento
                        </div>
                    </Link>
                    <Link href="/private/mensalidades" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <DollarSign size={20} /> Mensalidades
                        </div>
                    </Link>
                    <Link href="/private/exames" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <File size={20} /> Exames Complementares
                        </div>
                    </Link>
                    <Link href="/private/atendimentos" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <Activity size={20} /> Atendimentos
                        </div>
                    </Link>
                    <Link href="/private/osteopatia" onClick={handleCloseSidebar}>
                        <div className="flex items-center gap-3 p-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            <Crosshair size={20} /> Osteopatia
                        </div>
                    </Link>
                </nav>

                {/* Botão de sair */}
                <div className="absolute bottom-4 left-0 w-full px-6">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        <X size={20} /> Sair
                    </button>
                </div>
            </div>
        </>
    );
}
