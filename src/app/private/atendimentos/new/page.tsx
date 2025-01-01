"use client"

import DeniedPage from "@/app/denied/page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAPI } from "@/service/API";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePacienteContext } from "@/context/PacienteContext";

import { format } from "date-fns";

const formSchema = z.object({
    dataAtendimento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" }),

    observacao: z
        .enum([ 'COMPARECEU', 'FALTA DADA', 'FALTA A RECUPERAR', 'RECUPERAÇÃO' ], { message: "Selecione uma observação válida" }),

    atendimento: z
        .enum([ 'Pilates', 'Fisioterapia Pelvica', 'Fisioterapia Obstetricia', 'Osteopatia', 'Liberação Miofascial', 'Drenagem Pós-Operatoria', 'LPF', 'Fisioterapia Vestibular', 'Tratamento de Diastase' ], { message: "Selecione uma situação válida" }),

    anotacoes: z
        .string()
        .max(10000, { message: "Nome deve ter no máximo 10000 caracteres" })
        .optional(),
})

export default function NovoAtendimento() {

    const { pacienteSelecionado } = usePacienteContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataAtendimento: format(new Date(), "yyyy-MM-dd"), //new Date().toISOString().split('T')[ 0 ],
            observacao: "COMPARECEU",
            atendimento: "Pilates",
            anotacoes: "",
        }
    })

    const { data: session } = useSession();
    const { reset } = useForm<z.infer<typeof formSchema>>();
    const router = useRouter();
    const api = useAPI();
    const { toast } = useToast()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const dadosAjustados = {
            ...data,
            dataAtendimento: `${data.dataAtendimento}T00:00:00.000Z`,
        };

        console.log(dadosAjustados)

        try {
            const response = await api.post("/atendimento", {
                idPaciente: pacienteSelecionado?.id,
                dataAtendimento: dadosAjustados.dataAtendimento,
                observacao: dadosAjustados.observacao,
                anotacoes: dadosAjustados.anotacoes,
                atendimento: dadosAjustados.atendimento
            });

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Cadastro de Atendimento",
                    description: "Cadastro realizado com sucesso",
                })
            }
            console.log("Cadastro realizado com sucesso", response.data);
            router.push(`/private/atendimentos?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx                     
                console.error('Erro ao cadastrar atendimento: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar atendimento",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário 
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta 
                console.error('Erro ao cadastrar atendimento. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar atendimento. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao cadastrar atendimento. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica 
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar atendimento. Erro inesperado",
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

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    return (
        <div className="bg-slate-300 text-slate-900 w-full h-auto flex justify-center items-start">
            <div className="flex flex-col items-center bg-slate-300 w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Novo Atendimento
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-1/2">
                        <div className="grid grid-cols-[1fr,2fr,2fr] gap-4">
                            <FormField
                                control={form.control}
                                name="dataAtendimento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Data Atendimento</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="date"
                                                name="dataAtendimento"
                                                className="w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="observacao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Observação</FormLabel>
                                        <FormControl>
                                            <Select {...field} defaultValue="COMPARECEU" onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione a Observação" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="COMPARECEU">Compareceu</SelectItem>
                                                    <SelectItem value="FALTA DADA">Falta Dada</SelectItem>
                                                    <SelectItem value="FALTA A RECUPERAR">Falta a Recuperar</SelectItem>
                                                    <SelectItem value="RECUPERAÇÃO">Recuperação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="atendimento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Atendimento</FormLabel>
                                        <FormControl>
                                            <Select {...field} defaultValue="Pilates" onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione o Atendimento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pilates">Pilates</SelectItem>
                                                    <SelectItem value="Fisioterapia Pelvica">Fisioterapia Pelvica</SelectItem>
                                                    <SelectItem value="Fisioterapia Obstetricia">Fisioterapia Obstetricia</SelectItem>
                                                    <SelectItem value="Osteopatia">Osteopatia</SelectItem>
                                                    <SelectItem value="Liberação Miofascial">Liberação Miofascial</SelectItem>
                                                    <SelectItem value="Drenagem Pós-Operatoria">Drenagem Pós-Operatoria</SelectItem>
                                                    <SelectItem value="LPF">LPF</SelectItem>
                                                    <SelectItem value="Fisioterapia Vestibular">Fisioterapia Vestibular</SelectItem>
                                                    <SelectItem value="Tratamento de Diastase">Tratamento de Diastase</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="anotacoes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="col-span-1 font-semibold">Anotações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="w-full border p-2 bg-white text-black resize-none"
                                            rows={15}
                                        />
                                    </FormControl>
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
        </div >
    )
}