"use client"

import DeniedPage from "@/app/denied/page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/service/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePacienteContext } from "@/context/PacienteContext";

const formSchema = z.object({
    dataFoto: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" }),
    caminho: z
        .string()
        .url({ message: "Insira um caminho válido" }),
})

export default function NovaFoto() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataFoto: new Date().toISOString().split('T')[ 0 ], //format(new Date(), "yyyy-MM-dd"),
            caminho: ""
        }
    })

    const { pacienteSelecionado } = usePacienteContext();
    const { data: session } = useSession();
    const api = useAPI();
    const { toast } = useToast()
    const router = useRouter();
    const { reset } = form;

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {

        console.log(data)

        try {
            const response = await api.post("/foto", {
                idPaciente: pacienteSelecionado?.id,
                dataFoto: data.dataFoto,
                caminho: data.caminho
            });

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Cadastro de Foto de Acompanhamento",
                    description: "Foto cadastrada com sucesso",
                })
            }
            console.log("Foto cadastrada com sucesso", response.data);
            router.push(`/private/fotos?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao cadastrar foto: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar foto",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao cadastrar foto. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar foto. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao cadastrar foto. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar foto. Erro inesperado",
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

    return (
        <>
            <div className="text-slate-900 w-full h-auto flex justify-center items-start mt-16">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-2xl font-bold mt-1">
                        Nova Foto
                    </h1>
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