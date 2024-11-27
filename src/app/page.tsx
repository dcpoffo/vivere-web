// pages/index.js
"use client"
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login/form-login';
import { SignOutButton } from '@/components/signOutButton';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center font-semibold'>
      {session && session.user ? (
        <>
          <p>Olá {session.user.name}!</p>
          <SignOutButton />

          <button className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4'>
            <Link href="/private/pacientes">
              Pacientes privado
            </Link>
          </button>

          <button className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4'>
            <Link href="/public/pacientes">
              Pacientes publico
            </Link>
          </button>

          {/* <Link href="/private/pacientes">
            <a className="mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4">
              Pacientes sem botao
            </a>
          </Link> */}

          <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-10">{JSON.stringify(session, null, 2)}</pre>
        </>
      ) : (
        <LoginForm />
        // <p>Você não está autenticado.</p>
      )}
    </div>
  );
} 
