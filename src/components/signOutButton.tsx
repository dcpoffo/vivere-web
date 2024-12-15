'use client'

//import { signOut } from "auth"

import { signOut } from "next-auth/react"

export const SignOutButton = () => {
    return (
        <button
            className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4'
            onClick={() => signOut()}
        >
            Sair
        </button>

    )
}