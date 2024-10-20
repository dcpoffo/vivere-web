'use client'

import React, { useState } from "react"
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const LoginForm = () => {

    const router = useRouter();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email,
                password
            })

            console.log("[LOGIN_RESPONSE]: ", response)

            if (!response?.error) {
                const session = await getSession(); // Verifica se a sessão foi criada
                if (session) {
                    router.push("/"); // Redireciona apenas se a sessão existir
                } else {
                    setError("Não foi possível verificar a sessão.");
                }
            } else {
                setError("E-mail ou senha inválidos");
            }

        } catch (error) {
            console.log("[LOGIN ERROR]: ", error)
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="p-10 border border-blue-500 rounded-lg w-96"
            >
                <h1 className="text-3xl font-bold mb-4">Login</h1>
                <p className="text-sm text-slate-700 mb-10">Faça login para continuar</p>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-1 mb-6">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded w-full p-3"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mb-6">
                        <label htmlFor="email">Senha</label>
                        <input
                            type="text"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full p-3"
                        />
                    </div>
                    {error && <span className="text-red-400 text-sm font-bold block mt-2">{error}</span>}
                    <Button
                        className="mt-4 rounded h-12"
                        type="submit"
                    >
                        Entrar
                    </Button>
                </div>
            </form>
        </div>
    )
}
export { LoginForm }