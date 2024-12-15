// pages/index.js
//import { LoginForm } from '@/components/login/form-login';
//import { SignOutButton } from '@/components/signOutButton';
import { SignOutButton } from '@/components/signOutButton';
import { auth, signIn, signOut } from 'auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {

  const sessao = await auth();

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center font-semibold'>
      {sessao && sessao.user ? (
        <>
          <p>Olá {sessao.user.name}!</p>
          <button className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600'>
            <Link href="/private/pacientes">
              Pacientes privado
            </Link>
          </button>

          <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-">{JSON.stringify(sessao, null, 2)}</pre>

          {/* <SignOutButton /> */}
          <form action={async () => {
            "use server";
            await signOut()
          }}>
            <button type='submit'>Sair</button>

          </form>

        </>
      ) : (
        //<LoginForm />
        <form action={async () => {
          "use server";
          await signIn()
        }}>
          <button type='submit'>Entrar</button>

        </form>
      )}
    </div>
  );
}


// // pages/index.js
// "use client"
// import { useSession } from 'next-auth/react';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { LoginForm } from '@/components/login/form-login';
// import { SignOutButton } from '@/components/signOutButton';
// import Link from 'next/link';
// import { auth } from 'auth';

// export default function Home() {

//   const sessao = await auth();
//   const { data: session } = useSession();
//   const router = useRouter();

//   return (
//     <div className='w-full h-screen flex flex-col justify-center items-center font-semibold'>
//       {session && session.user ? (
//         <>
//           <p>Olá {session.user.name}!</p>
//           <SignOutButton />

//           <button className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4'>
//             <Link href="/private/pacientes">
//               Pacientes privado
//             </Link>
//           </button>

//           <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-10">{JSON.stringify(session, null, 2)}</pre>
//         </>
//       ) : (
//         <LoginForm />
//         // <p>Você não está autenticado.</p>
//       )}
//     </div>
//   );
// } 
