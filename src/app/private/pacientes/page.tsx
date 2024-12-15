"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import BuscaPaciente from "@/components/buscaPaciente/buscaPaciente";
import { usePacienteContext } from "@/context/PacienteContext";
import { Paciente } from "@/types/Paciente";
import { Button } from "@/components/ui/button";
import DeniedPage from "@/app/denied/page";

export default function Pacientes() {
    const { pacienteSelecionado, selecionarPaciente } = usePacienteContext();
    const [ editando, setEditando ] = useState(false);
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const [ dadosOriginais, setDadosOriginais ] = useState<Paciente | null>(pacienteSelecionado);

    useEffect(() => {
        setDadosPaciente(pacienteSelecionado);
        setDadosOriginais(pacienteSelecionado);
    }, [ pacienteSelecionado ]);

    const handlePacienteSelecionado = (paciente: Paciente) => {
        selecionarPaciente(paciente);
        setDadosPaciente(paciente);
        setDadosOriginais(paciente);
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dadosPaciente) {
            try {
                selecionarPaciente(dadosPaciente);
                setEditando(false);
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        } else {
            console.error("Dados do paciente não estão disponíveis.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (dadosPaciente) {
            const { name, value } = e.target;
            setDadosPaciente((prev) => ({ ...prev!, [ name ]: value }));
        }
    };

    const handleAlterar = () => setEditando(true);
    const handleCancelar = () => {
        setDadosPaciente(dadosOriginais);
        setEditando(false);
    };

    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
                {/* <button
                    onClick={() => signIn()}
                    className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md"
                >
                    Entrar
                </button> */}
            </div>
        );
    }

    return (
        <div className="bg-slate-300 text-slate-900 w-full h-screen flex justify-center items-start">
            {dadosPaciente ? (
                <div className="flex flex-col items-center bg-slate-300 w-full">
                    <h1 className="text-2xl font-bold mb-4">Informações do paciente</h1>
                    <form onSubmit={handleSalvar} className="flex flex-col gap-4 w-1/2">
                        <div className="grid grid-cols-5 gap-2 items-center">
                            <label className="col-span-1 font-semibold">
                                Código
                                <input
                                    type="text"
                                    name="id"
                                    value={dadosPaciente.id || ""}
                                    disabled
                                    className="w-full border p-2"
                                />
                            </label>
                            <label className="col-span-4 font-semibold">
                                Nome
                                <input
                                    type="text"
                                    name="nome"
                                    value={dadosPaciente.nome || ""}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        {/* Campos adicionais aqui */}
                        <div className="flex gap-4 mt-4 mb-4 justify-end">
                            {editando ? (
                                <>
                                    <Button type="submit" className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md">
                                        Salvar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleCancelar}
                                        className="px-4 py-2 h-10 text-white"
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAlterar}
                                    className="px-4 py-2 h-10 bg-green-700 text-white rounded-md"
                                >
                                    Alterar cadastro
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="flex justify-center items-center mt-4 space-x-4">
                        <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="px-4 py-2 h-10 bg-red-600 text-white rounded-md"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pt-10 bg-slate-300 text-slate-900 w-full h-screen flex flex-col justify-center items-center">
                    <p>Nenhum paciente selecionado</p>
                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="px-4 py-2 h-10 bg-red-600 text-white rounded-md"
                    >
                        Sair
                    </button>
                </div>
            )}
        </div>
    );
}
