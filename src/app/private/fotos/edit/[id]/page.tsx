"use client"

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/service/API";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeniedPage from "@/app/denied/page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    dataFoto: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" }),
    caminho: z
        .string()
        .url({ message: "Insira um caminho válido" }),
})

type Foto = {
    dataFoto: string,
    caminho: string
}

export default function EditFotosPage() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataFoto: new Date().toISOString().split('T')[ 0 ],
            caminho: ""
        }
    })

    const [ formData, setFormData ] = useState<Foto | null>(null);
    const { id } = useParams();
    const api = useAPI();
    const { toast } = useToast()
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/foto/id?id=${id}`);
                const fetchedData = response.data;

                if (fetchedData) {
                    console.log(fetchedData)
                    const originalDate = new Date(fetchedData.dataFoto);

                    const adjustedDate = originalDate.toISOString().split("T")[ 0 ];

                    form.reset({
                        dataFoto: adjustedDate,
                        caminho: fetchedData.caminho
                    })

                }
            } catch (error) {
                toast({
                    duration: 4000,
                    title: "Erro ao carregar foto",
                    description: "NÂO foi possível carregar os dados da foto.",
                });
            }
        }

        if (id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ id, toast ]);

    const handleCancelar = () => {
        router.back(); // Volta para a página anterior
    };

    const { data: session } = useSession();

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
        const dadosAjustados = {
            ...data,
            dataFoto: `${data.dataFoto}T00:00:00.000Z`,
        };

        try {
            const response = await api.put(`/foto?id=${id}`, dadosAjustados);

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Alteração de Foto de Acompanhamento",
                    description: "Foto de Acompanhamento atualizada com sucesso",
                })
            }
            console.log("Foto de Acompanhamento atualizada com sucesso", response.data);
            router.push(`/private/fotos?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao atualizar Foto de Acompanhamento: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar Foto de Acompanhamento",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao atualizar Foto de Acompanhamento. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar Foto de Acompanhamento. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao atualizar Foto de Acompanhamento. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar Foto de Acompanhamento. Erro inesperado",
                    description: error.message,
                })
            }
        }
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
                <div className="flex flex-col items-center w-full">
                    {/* <h1 className="text-2xl font-bold mb-4 mt-20">
                        Alterar Foto
                    </h1> */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-7/12 mt-2">
                            <div>
                                <div className="w-1/5 mb-2">
                                    <FormField
                                        control={form.control}
                                        name="dataFoto"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="col-span-1 font-semibold">Data Foto</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="date"
                                                        name="dataFoto"
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
                                    name="caminho"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="col-span-1 font-semibold">Caminho</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    name="caminho"
                                                    className="w-full border p-2 bg-white text-black"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4 my-2">
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

