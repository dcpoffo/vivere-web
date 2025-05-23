'use client'

import React, { useEffect, useState } from "react"
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { usePacienteContext } from "@/context/PacienteContext";

const LoginForm = () => {

    const router = useRouter();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const { pacienteSelecionado, limparPacienteSelecionado } = usePacienteContext();

    useEffect(() => {
        const checkSessionAndSignOut = async () => {
            const session = await getSession();
            if (session) {
                limparPacienteSelecionado();
                // Se uma sessão estiver ativa, faz o logout para limpar o token
                await signOut({ redirect: false });
            }
        };

        checkSessionAndSignOut();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (response?.error) {
                setError("E-mail ou senha inválidos");
            } else {
                // Verifica a sessão diretamente após o login
                const session = await getSession();
                if (session) {
                    router.push("/"); // Redireciona para a página inicial se a sessão for válida
                } else {
                    setError("Não foi possível verificar a sessão.");
                }
            }
        } catch (error) {
            setError("Erro ao tentar fazer login.");
        }
    }

    return (
        // <div className="w-full flex-grow flex items-center justify-center">
        <div className="w-full h-screen flex flex-col justify-center items-center bg-nubank">

            <form
                onSubmit={handleLogin}
                className="p-10 border border-roxoClaro rounded-lg w-96"
            >
                <h1 className="text-3xl font-bold mb-4">Vivere Pilates</h1>
                <p className="text-lg text-black mb-10">Faça login para continuar</p>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-1 mb-6">
                        <label htmlFor="email">E-mail</label>
                        <input
                            placeholder="email@email.com"
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-sm w-full p-3 bg-slate-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mb-6">
                        <label htmlFor="email">Senha</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-sm w-full p-3 bg-slate-300"
                        />
                    </div>
                    {error && <span className="text-red-500 text-sm font-bold block mt-2">{error}</span>}
                    <Button
                        className="mt-4 rounded-sm h-12 text-lg bg-roxoEscuro hover:bg-roxoClaro"
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