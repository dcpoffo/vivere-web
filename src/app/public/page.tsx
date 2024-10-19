'use client'

import { useSession} from "next-auth/react"

export default function PublicPage() {
    const { data: session} = useSession()
    return (
        <div className='bg-slate-500 w-full h-screen flex flex-col justify-center items-center font-semibold'>
            <h1>Public Page</h1>
            {session && <pre className="bg-slate-900 text-slate-50 p-10 rounded-lg mt-10">{JSON.stringify(session, null, 2)}</pre>}
        </div>
    )
}