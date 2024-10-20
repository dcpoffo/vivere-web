'use client';

import Link from 'next/link';
import React from 'react';
import { SignOutButton } from '../signOutButton';
import { useSession } from 'next-auth/react';

export function Header() {
    const { data: session, status } = useSession(); // Usa `useSession` no lado do cliente

    return (
        <header className='fixed w-full h-20 flex items-center bg-slate-400 text-slate-900'>
            <nav className='w-full flex items-center justify-between m-auto max-w-screen-xl'>
                {/* <Link href="/">Logo</Link> */}
                <ul className='flex items-center gap-5 font-semibold'>
                    <li><Link href="/">Início</Link></li>
                    {session && (
                        <>
                            <li className="relative">
                                <Link href="/private/cadastro">Cadastro</Link>
                                <span className="absolute right-[-10px]">|</span> {/* Separador */}
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
                    {/* <li className="ml-auto">
                        {session && <SignOutButton />}
                    </li> */}
                </ul>
                {session && (
                    <div className="ml-auto font-semibold">
                        <SignOutButton />
                    </div>
                )}

            </nav>
        </header>
    );
};


// <header className="ml-[270px] mt-1 min-h-[100px] bg-blue-100">
//     <div className="mx-8 text-2xl ">
//         Aqui vão as futuras informações do header
//     </div>
// </header>