import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { SignOutButton } from '../signOutButton';

export function Header(){
    return (
        <header className='fixed w-full h-20 flex items-center bg-violet-400 text-slate-50'>
            <nav className='w-full flex items-center justify-between m-auto max-w-screen-xl'>
                <Link href="/">Logo</Link>
                <ul className='flex items-center gap-10'>
                    <li><Link href="/">Início</Link></li>
                    <li><Link href="/private/teste">Teste</Link></li>
                    <li><Link href="/public">Publica</Link></li>
                    <li><Link href="/private">Privada</Link></li>
                    <li><SignOutButton/></li>
                </ul>
            </nav>
        </header>

        // <header className="ml-[270px] mt-1 min-h-[100px] bg-blue-100">
        //     <div className="mx-8 text-2xl ">
        //         Aqui vão as futuras informações do header
        //     </div>
        // </header>
    );
};