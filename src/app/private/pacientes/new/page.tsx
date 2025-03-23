"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import DeniedPage from "@/app/denied/page";
import { useAPI } from "@/service/API";
import { useToast } from "@/hooks/use-toast";
import { usePacienteContext } from "@/context/PacienteContext";
import { useState } from "react";

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

    situacao: z.enum([ 'ATIVO', 'INATIVO' ], { message: "Selecione uma situação válida" }),

    dataNascimento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" })
})

export default function NovoPaciente() {
    const [ cpf, setCpf ] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            situacao: "ATIVO",
            cpf: "",
            contato1: "",
            contato2: "",
            endereco: "",
            profissao: "",
            email: "",
            dataNascimento: new Date().toISOString().split('T')[ 0 ],
        }
    })

    const { reset } = form;
    const router = useRouter();
    const api = useAPI();
    const { toast } = useToast()
    const { addPaciente } = usePacienteContext();

    async function onSubmit(data: z.infer<typeof formSchema>) {

        const dadosAjustados = {
            ...data,
            dataNascimento: `${data.dataNascimento}T00:00:00.000Z`,
        };

        try {
            const response = await api.post("/paciente", dadosAjustados);
            addPaciente(response.data)

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Cadastro de Paciente",
                    description: "Cadastro realizado com sucesso",
                })
            }
            console.log("Cadastro realizado com sucesso", response.data);
            router.push(`/private/pacientes?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao cadastrar paciente: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar paciente",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao cadastrar paciente. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar paciente. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao cadastrar paciente. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar paciente. Erro inesperado",
                    description: error.message,
                })
            }
        }
    }

    const handleCancelar = () => {
        reset();
        console.log("Cadastro cancelado.");
        router.back(); // Volta para a página anterior
    };

    function gerarCPF() {
        const random = (n: number) => Math.floor(Math.random() * n);

        let n = 9; let n1 = random(n), n2 = random(n), n3 = random(n), n4 = random(n), n5 = random(n), n6 = random(n), n7 = random(n), n8 = random(n), n9 = random(n);

        let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;

        d1 = 11 - (d1 % 11);

        if (d1 >= 10)
            d1 = 0;
        let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11; d2 = 11 - (d2 % 11);

        if (d2 >= 10)
            d2 = 0;

        return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
    }

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
            <div className="flex flex-col items-center bg-slate-300 w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Cadastro de Paciente
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="col-span-1 font-semibold">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
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
                                            <Select {...field} defaultValue="ATIVO" onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione a Situação" />
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
                                        <div className="flex items-center justify-center gap-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="xxx.xxx.xxx-xx"
                                                    className="w-full border p-2 bg-white text-black"

                                                    value={cpf}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setCpf(e.target.value); // Atualiza o estado ao digitar
                                                    }}

                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className="bg-violet-500 text-white"
                                                onClick={() => {
                                                    const novoCPF = gerarCPF();
                                                    setCpf(novoCPF);
                                                    field.onChange(novoCPF);
                                                }}
                                            >
                                                Gerar CPF
                                            </Button>
                                        </div>
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
                            <Button
                                type="button"
                                variant={"destructive"}
                                onClick={handleCancelar}
                            >
                                Cancelar / Voltar
                            </Button>

                            <Button type="submit">Salvar</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}