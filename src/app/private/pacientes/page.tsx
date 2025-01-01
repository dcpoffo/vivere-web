"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import BuscaPaciente from "@/components/buscaPaciente/buscaPaciente";
import { usePacienteContext } from "@/context/PacienteContext";
import { Paciente } from "@/types/Paciente";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import DeniedPage from "@/app/denied/page";
import { SignOutButton } from "@/components/signOutButton";
import { Input } from "@/components/ui/input";
import { useAPI } from "@/service/API";
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    nome: z
        .string()
        .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
        .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),

    cpf: z
        .string()
        .nonempty('O CPF é obrigatório.')
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'O CPF deve estar no formato xxx.xxx.xxx-xx.')
        .refine(isValidCPF, { message: 'CPF inválido.' }),

    contato1: z
        .string()
        .max(15, { message: "Contato deve ter no máximo 15 caracteres" })
        .optional(),

    contato2: z
        .string()
        .max(15, { message: "Contato deve ter no máximo 15 caracteres" })
        .optional(),

    endereco: z
        .string()
        .max(200, { message: "Contato deve ter no máximo 200 caracteres" })
        .optional(),

    profissao: z
        .string()
        .max(30, { message: "Contato deve ter no máximo 30 caracteres" })
        .optional(),

    email: z
        .string()
        .optional(),

    situacao: z
        .string()
        .optional(),

    dataNascimento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" })
})

function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove os caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

export default function Pacientes() {
    const { pacienteSelecionado, selecionarPaciente } = usePacienteContext();
    const [ editando, setEditando ] = useState(false);
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const [ dadosOriginais, setDadosOriginais ] = useState<Paciente | null>(pacienteSelecionado);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            contato1: "",
            contato2: "",
            endereco: "",
            profissao: "",
            email: "",
            situacao: "",
            cpf: "",
            dataNascimento: new Date().toISOString().split('T')[ 0 ],
        }
    })

    useEffect(() => {
        if (pacienteSelecionado) {
            console.log(pacienteSelecionado.situacao)
            form.reset({
                nome: pacienteSelecionado.nome,
                //situacao: pacienteSelecionado.situacao as "ATIVO" | "INATIVO",  // Verifique se "INATIVO" está sendo corretamente atribuído
                situacao: pacienteSelecionado.situacao,
                cpf: pacienteSelecionado.cpf,
                contato1: pacienteSelecionado.contato1,
                contato2: pacienteSelecionado.contato2,
                endereco: pacienteSelecionado.endereco,
                profissao: pacienteSelecionado.profissao,
                email: pacienteSelecionado.email,
                dataNascimento: pacienteSelecionado.dataNascimento
                    ? pacienteSelecionado.dataNascimento.split('T')[ 0 ]
                    : new Date().toISOString().split('T')[ 0 ]
            });
        }
    }, [ pacienteSelecionado, form ]);

    console.log(pacienteSelecionado?.situacao)

    // useEffect(() => {
    //     setDadosPaciente(pacienteSelecionado);
    //     setDadosOriginais(pacienteSelecionado);
    //     if (pacienteSelecionado) {
    //         form.reset({
    //             nome: pacienteSelecionado.nome,
    //             situacao: pacienteSelecionado.situacao as "ATIVO" | "INATIVO",
    //             cpf: pacienteSelecionado.cpf,
    //             contato1: pacienteSelecionado.contato1,
    //             contato2: pacienteSelecionado.contato2,
    //             endereco: pacienteSelecionado.endereco,
    //             profissao: pacienteSelecionado.profissao,
    //             email: pacienteSelecionado.email,
    //             dataNascimento: pacienteSelecionado.dataNascimento
    //                 ? pacienteSelecionado.dataNascimento.split('T')[ 0 ]
    //                 : new Date().toISOString().split('T')[ 0 ]
    //         })            
    //     }
    //     console.log(pacienteSelecionado);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [ pacienteSelecionado ]);
    // // 

    const handlePacienteSelecionado = (paciente: Paciente) => {
        selecionarPaciente(paciente);
        setDadosPaciente(paciente);
        setDadosOriginais(paciente);
    };

    const api = useAPI();
    const { toast } = useToast()


    async function onSubmit(data: z.infer<typeof formSchema>) {
        const dadosAjustados = {
            ...data,
            dataNascimento: `${data.dataNascimento}T00:00:00.000Z`,
        };
        if (dadosPaciente) {
            try {
                const response = await api.put(`/paciente?id=${dadosPaciente.id}`, dadosAjustados); // Use dadosAjustados aqui
                selecionarPaciente(response.data);
                console.log(response.data);

                if (response.data) {
                    toast({
                        duration: 3000,
                        title: "Atualização de Cadastro",
                        description: "Cadastro atualizado com sucesso",
                    });
                }
                setEditando(false);
            } catch (error: any) {
                if (error.response) {
                    // O servidor respondeu com um status diferente de 2xx                     
                    console.error('Erro ao atualizar cadastro:', error.response.data.message);
                    toast({
                        duration: 4000,
                        variant: "destructive",
                        title: "Erro ao atualizar cadastro",
                        description: error.response.data.message,
                    })
                    // Exibir a mensagem de erro para o usuário 
                } else if (error.request) {
                    // A requisição foi feita mas não houve resposta 
                    console.error('Erro ao atualizar cadastro. Sem resposta do servidor. ', error.request);
                    toast({
                        duration: 4000,
                        variant: "destructive",
                        title: "Erro ao atualizar cadastro. Sem resposta do servidor",
                        description: error.request,
                    })
                } else {
                    // Algo aconteceu ao configurar a requisição c
                    console.error('Erro ao atualizar cadastro. Erro inesperado', error.message);
                    // Exibir uma mensagem de erro genérica 
                    toast({
                        duration: 4000,
                        variant: "destructive",
                        title: "Erro ao atualizar cadastro. Erro inesperado",
                        description: error.message,
                    })
                }
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (dadosPaciente) {
            const { name, value } = e.target;
            const formattedValue = name === "dataNascimento" ? `${value}T00:00:00.000Z` : value;

            setDadosPaciente((prev) => ({ ...prev!, [ name ]: formattedValue }));
        }
    };

    const handleAlterar = () => setEditando(true);

    const handleCancelar = () => {
        if (dadosOriginais) {
            setDadosPaciente(dadosOriginais);
            const dataFormatada = dadosOriginais.dataNascimento
                ? dadosOriginais.dataNascimento.split('T')[ 0 ]
                : new Date().toISOString().split('T')[ 0 ];
            form.reset({
                nome: dadosOriginais.nome,
                situacao: dadosOriginais.situacao,
                cpf: dadosOriginais.cpf,
                dataNascimento: dataFormatada,
                contato1: dadosOriginais.contato1,
                contato2: dadosOriginais.contato2,
                endereco: dadosOriginais.endereco,
                profissao: dadosOriginais.profissao,
                email: dadosOriginais.email,
            });
        }
        setEditando(false);
    };


    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    return (
        <div className="bg-slate-300 text-slate-900 w-9/12 h-auto flex justify-center items-start">
            {dadosPaciente ? (
                <div className="flex flex-col items-center bg-slate-300 w-full">
                    <h1 className="text-2xl font-bold mb-4">
                        Informações do Paciente
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-1/2">
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!editando}
                                                placeholder="Nome do Paciente"
                                                className="w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="situacao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="col-span-1 font-semibold">Situação</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    disabled={!editando}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                        <SelectValue placeholder="Selecione o Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ATIVO">ATIVO</SelectItem>
                                                        <SelectItem value="INATIVO">INATIVO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="col-span-1 font-semibold">C.P.F.</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editando}
                                                    placeholder="xxx.xxx.xxx-xx"
                                                    className="w-full border p-2 bg-white text-black"
                                                />
                                            </FormControl>
                                            <FormDescription>Considerar o CPF com pontos e hífem (xxx.xxx.xxx-xx).</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="contato1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="col-span-1 font-semibold">Contato 1</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editando}
                                                    className="w-full border p-2 bg-white text-black"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contato2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="col-span-1 font-semibold">Contato 2</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editando}
                                                    className="w-full border p-2 bg-white text-black"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="dataNascimento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Data Nascimento</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!editando}
                                                type="date"
                                                name="dataNascimento"
                                                className="w-40 border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endereco"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Endereço</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                disabled={!editando}
                                                className="w-full border p-2 bg-white text-black resize-none"
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">E-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!editando}
                                                placeholder="email@email.com"
                                                className="w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="profissao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Profissão</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!editando}
                                                className="w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4 mt-2">
                                {editando && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleCancelar}
                                            className="px-4 py-2 h-10 text-white hover:bg-red-400"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                        >
                                            Salvar
                                        </Button>
                                    </>
                                )}
                            </div>

                        </form>
                    </Form>
                    <>
                        {!editando &&
                            <div className="flex gap-2 justify-end items-center">
                                <Link href="/private/pacientes/new">
                                    <Button
                                        type="button"
                                        className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                    >
                                        Novo Paciente
                                    </Button>
                                </Link>
                                <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                                <Button
                                    type="button"
                                    onClick={handleAlterar}
                                    className="px-4 py-2 h-10 bg-green-700 text-white rounded-md  hover:bg-green-600"
                                >
                                    Alterar cadastro
                                </Button>
                            </div>}
                    </>
                </div>
            ) : (
                <div className="pt-10 bg-slate-300 text-slate-900 w-full h-auto flex flex-col justify-center items-center">
                    <p>Nenhum paciente selecionado</p>
                    <Link href="/private/pacientes/new">
                        <Button
                            type="button"
                            className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                        >
                            Novo Paciente
                        </Button>
                    </Link>
                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                    <SignOutButton />
                </div>
            )}
        </div>
    );
}
