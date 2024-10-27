"use client";

import Link from "next/link";
import React from "react";
import { SignOutButton } from "../signOutButton";
import { useSession } from "next-auth/react";

export function Header() {
    const { data: session } = useSession(); // Usa `useSession` no client-side

    return (
        <header className="fixed w-full h-14 flex items-center bg-slate-400 text-slate-900">
            <nav className="w-full flex items-center justify-between m-auto max-w-screen-xl">
                <ul className="flex items-center gap-5 font-semibold">
                    {session && (
                        <>
                            <li>
                                <Link href="/">Início</Link>
                            </li>
                            <li className="relative">
                                <Link href="/private/pacientes">Pacientes</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/fichaAvaliacoes">Ficha de Avaliações</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/fotos">Fotos de Acompanhamento</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/mensalidades">Mensalidades</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/exames">Exames Complementares</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/atendimentos">Atendimentos</Link>
                                <span className="absolute right-[-10px]">|</span>
                            </li>
                            <li className="relative">
                                <Link href="/private/osteopatia">Osteopatia</Link>
                            </li>
                        </>
                    )}
                </ul>
                {session && (
                    <div className="ml-auto font-semibold">
                        <SignOutButton />
                    </div>
                )}
            </nav>
        </header>
    );
}
