// pages/index.js
"use client"
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [ session, router ]);

  return (
    <div className='bg-slate-300 w-full h-screen flex flex-col justify-center items-center font-semibold'>
      <h1>Página Inicial</h1>
      {session && session.user ? (
        <>
          <p>Bem-vindo(a) {session.user.name}!</p>
          <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-10">{JSON.stringify(session, null, 2)}</pre>
        </>
      ) : (
        <p>Você não está autenticado.</p>
      )}
    </div>
  );
}


// export default function Home() {
//   return (
//     <div className='bg-slate-500 text-slate-900 w-full h-screen flex justify-center items-center font-semibold'>
//       <h1>Home Page</h1>
//     </div>
//   );
// }
