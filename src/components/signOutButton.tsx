'use client'

//import { signOut } from "auth"

import { signOut } from "next-auth/react"

export const SignOutButton = () => {
    return (
        <button
            className="px-4 py-2 h-10 bg-red-600 hover:bg-red-400 text-white rounded-md"
            //className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4'
            onClick={() => signOut({ callbackUrl: '/login' })}
        >
            Sair
        </button>

    )
}