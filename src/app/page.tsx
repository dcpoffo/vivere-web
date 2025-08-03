import { SignOutButton } from '@/components/signOutButton';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {

  const sessao = await auth();

  if (!sessao || !sessao.user) {
    redirect('/login');
  }

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center font-semibold'>
      <p>Olá {sessao.user.name}!</p>

      <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-">{JSON.stringify(sessao, null, 2)}</pre>

      <SignOutButton />
    </div>
  );
}

// import { SignOutButton } from '@/components/signOutButton';
// import { auth, signIn } from 'auth';

// // eslint-disable-next-line @next/next/no-async-client-component
// export default async function Home() {

//   const sessao = await auth();

//   return (
//     <div className='w-full h-screen flex flex-col justify-center items-center font-semibold'>
//       {sessao && sessao.user ? (
//         <>
//           <p>Olá {sessao.user.name}!</p>

//           <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-">{JSON.stringify(sessao, null, 2)}</pre>

//           <SignOutButton />
//         </>
//       ) : (
//         <form action={async () => {
//           "use server";
//           await signIn()
//         }}>
//           <button type='submit'>Entrar</button>

//         </form>
//       )}
//     </div>
//   );
// }