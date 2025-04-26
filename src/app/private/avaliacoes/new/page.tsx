"use client";
import { useAPI } from "@/service/API";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectPadrao } from "@/components/select/SelectPadrao";
import { Textarea } from "@/components/ui/textarea";
import { usePacienteContext } from "@/context/PacienteContext";
import { useSession } from "next-auth/react";
import DeniedPage from "@/app/denied/page";

const formSchema = z.object({
    indicacao: z
        .string()
        .max(30, { message: "No máximo 30 caracteres" })
        .optional(),

    atividadeFisica: z
        .enum([ 'NÃO', 'SIM' ], { message: "Selecione uma opção válida" }),

    qualAtividadeFisica: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    medicacao: z
        .string()
        .optional(),

    tabagismo: z
        .enum([ 'NÃO', 'SIM' ], { message: "Selecione uma opção válida" }),

    etilismo: z
        .enum([ 'NÃO', 'SIM' ], { message: "Selecione uma opção válida" }),

    hipertensao: z
        .enum([ 'NÃO', 'SIM' ], { message: "Selecione uma opção válida" }),

    doencas: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    dores: z
        .string()
        .max(10000, { message: "No máximo 10000 caracteres" })
        .optional(),

    posicaoDor: z
        .string()
        .max(10000, { message: "No máximo 10000 caracteres" })
        .optional(),

    objetivoPrincipal: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    queixaPrincipal: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    hda: z
        .string()
        .max(10000, { message: "No máximo 10000 caracteres" })
        .optional(),

    hpp: z
        .string()
        .max(10000, { message: "No máximo 10000 caracteres" })
        .optional(),

    peso: z
        .string()
        .max(6, { message: "No máximo 6 caracteres" })
        .optional(),

    altura: z
        .string()
        .max(4, { message: "No máximo 4 caracteres, contando com a , ou ." })
        .optional(),

    pa: z
        .string()
        .max(7, { message: "No máximo 7 caracteres" })
        .optional(),

    pes: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    joelhos: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    pelve: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    coluna: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    ombros: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    escapulas: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),

    cabeca: z
        .string()
        .max(200, { message: "No máximo 200 caracteres" })
        .optional(),
})

export default function NovaAvaliacao() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            indicacao: "",
            peso: "0,0",
            altura: "0,0",
            pa: "0,0",
            tabagismo: "NÃO",
            etilismo: "NÃO",
            hipertensao: "NÃO",
            atividadeFisica: "NÃO",
            qualAtividadeFisica: "",
            objetivoPrincipal: "",
            queixaPrincipal: "",
            doencas: "",
            medicacao: "",
            pes: "",
            pelve: "",
            ombros: "",
            joelhos: "",
            coluna: "",
            escapulas: "",
            cabeca: "",
        }
    })

    const { pacienteSelecionado } = usePacienteContext();
    const { data: session } = useSession();
    const { reset } = form;
    const router = useRouter();
    const api = useAPI();
    const { toast } = useToast();

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);

        try {
            const response = await api.post("/avaliacao", {

                idPaciente: pacienteSelecionado?.id,
                indicacao: data.indicacao,
                tabagismo: data.tabagismo,
                etilismo: data.etilismo,
                hipertensao: data.hipertensao,
                atividadeFisica: data.atividadeFisica,
                peso: data.peso,
                altura: data.altura,
                pa: data.pa,
                qualAtividadeFisica: data.qualAtividadeFisica,
                objetivoPrincipal: data.objetivoPrincipal,
                queixaPrincipal: data.queixaPrincipal,
                doencas: data.doencas,
                medicacao: data.medicacao,
                dores: data.dores,
                posicaoDor: data.posicaoDor,
                hda: data.hda,
                hpp: data.hpp,
                pes: data.pes,
                pelve: data.pelve,
                ombros: data.ombros,
                joelhos: data.joelhos,
                coluna: data.coluna,
                escapulas: data.escapulas,
                cabeca: data.cabeca
            });

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Cadastro de Avaliação",
                    description: "Avaliação cadastrada com sucesso",
                })
            }
            console.log("Avaliação cadastrada com sucesso", response.data);
            router.push(`/private/avaliacoes?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao cadastrar avaliação: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar avaliação",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao cadastrar avaliação. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar avaliação. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao cadastrar avaliação. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar avaliação. Erro inesperado",
                    description: error.message,
                })
            }
        }
    }

    const handleCancelar = () => {
        reset();
        console.log("Cadastro cancelado");
        router.back();
    }

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    return (
        <>
            <div className="text-slate-900 w-full h-auto flex justify-center items-start mt-16">
                <div className="flex flex-col items-center w-11/12">
                    <h1 className="text-2xl font-bold mt-1">
                        Nova Avaliação
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">

                            <Tabs defaultValue="anamnese" className=" flex flex-col justify-center w-full">

                                <TabsList className="justify-start mt-2">
                                    <TabsTrigger value="anamnese" className="font-bold">Anamnese</TabsTrigger>
                                    <TabsTrigger value="simetriaCorporal" className="font-bold">Simetria Corporal</TabsTrigger>
                                </TabsList>

                                <TabsContent value="anamnese">
                                    <FormField
                                        control={form.control}
                                        name="indicacao"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2 mb-2">
                                                <FormLabel className="col-span-1 font-semibold">Indicação</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="w-1/3 border p-2 bg-white text-black"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-7 gap-4 mb-2">
                                        <FormField
                                            control={form.control}
                                            name="peso"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Peso</FormLabel>
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
                                            name="altura"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Altura</FormLabel>
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
                                            name="pa"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">PA</FormLabel>
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
                                            name="tabagismo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SelectPadrao
                                                            label="Tabagismo"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            options={[
                                                                { value: "SIM", label: "SIM" },
                                                                { value: "NÃO", label: "NÃO" },
                                                            ]}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="etilismo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SelectPadrao
                                                            label="Etilismo"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            options={[
                                                                { value: "SIM", label: "SIM" },
                                                                { value: "NÃO", label: "NÃO" },
                                                            ]}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="hipertensao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <SelectPadrao
                                                            label="Hipertensão"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            options={[
                                                                { value: "SIM", label: "SIM" },
                                                                { value: "NÃO", label: "NÃO" },
                                                            ]}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-[auto,1fr] mb-2 w-1/2 gap-4">
                                        <div className="w-44">
                                            <FormField
                                                control={form.control}
                                                name="atividadeFisica"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <SelectPadrao
                                                                label="Atividade Física"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={[
                                                                    { value: "SIM", label: "SIM" },
                                                                    { value: "NÃO", label: "NÃO" },
                                                                ]}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="qualAtividadeFisica"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Qual atividade Física</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="objetivoPrincipal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Objetivo Principal</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="queixaPrincipal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Queixa Principal</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="doencas"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Doenças</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="medicacao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Medicação</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dores"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Dores</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="posicaoDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Posição da Dor</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="hda"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">H.D.A.</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="hpp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">H.P.P</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </TabsContent>

                                <TabsContent value="simetriaCorporal">
                                    <div className="grid grid-cols-3 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="pes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Pés</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="pelve"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Pelve</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="ombros"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Ombros</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* ****** */}

                                    <div className="grid grid-cols-3 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="joelhos"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Joelhos</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="coluna"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Coluna</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
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
                                            name="escapulas"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Escapulas</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 mb-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="cabeca"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Cabeça</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            //value={formData?.anotacoes || ""}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>

                            </Tabs>
                            <div className="grid grid-cols-4 gap-4 mb-4">
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
        </>
    )

}