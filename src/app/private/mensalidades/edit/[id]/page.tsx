"use client";

import DeniedPage from "@/app/denied/page";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/service/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    dataMensalidade: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato yyyy-MM-dd" }),

    pago: z
        .enum([ 'SIM', 'NÃO' ], { message: "Selecione uma observação válida" }),

    visualizar: z
        .enum([ 'SIM', 'NÃO' ], { message: "Selecione uma observação válida" }),

    cpfUsuarioLogado: z
        .string()
        .max(14, { message: "CPF deve ter no máximo 14 caracteres" }),

    ano: z
        .string()
        .regex(/^\d{4}$/, { message: "O ano deve ser numérico com 4 dígitos" })
        .nonempty({ message: "O ano é obrigatório" }),

    mes: z
        .enum([
            'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
            'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
        ], { message: "Selecione um mês válido" }),

    valor: z
        .string()
        .regex(/^\d+([,\.]\d{1,2})?$/, { message: "O valor deve estar no formato 1234,56 ou 1234.56" })
        .transform((val) =>
            parseFloat(val.replace(',', '.'))
        )
        .refine((val) => val > 0, { message: "O valor deve ser maior que zero" })

})

type Mensalidade = {
    dataMensalidade: string,
    pago: string,
    mes: string,
    ano: string,
    valor: string,
    visualizar: string,
    cpfUsuarioLogado: string
};

export default function EditMensalidadePage() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataMensalidade: new Date().toISOString().split('T')[ 0 ],
            pago: "SIM",
            mes: "JANEIRO",
            ano: "",
            valor: 0,
            visualizar: "SIM",
            cpfUsuarioLogado: ""
        }
    })

    const { id } = useParams(); // Captura o parâmetro da rota
    const [ formData, setFormData ] = useState<Mensalidade | null>(null);

    const api = useAPI();
    const { toast } = useToast()
    const router = useRouter();

    const { reset } = form;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/mensalidade/id?id=${id}`);
                const fetchedData = response.data;

                console.log(response.data);

                if (fetchedData) {
                    const originalDate = new Date(fetchedData.dataMensalidade);

                    const adjustedDate = originalDate.toISOString().split("T")[ 0 ];

                    // Prepara os dados para o formulário
                    const formattedData = {
                        dataMensalidade: adjustedDate,
                        pago: fetchedData.pago,
                        mes: fetchedData.mes,
                        ano: fetchedData.ano,
                        valor: fetchedData.valor,
                        visualizar: fetchedData.visualizar,
                        cpfUsuarioLogado: fetchedData.cpfUsuarioLogado
                    };

                    form.reset({
                        dataMensalidade: adjustedDate,
                        pago: formattedData.pago,
                        mes: formattedData.mes,
                        ano: formattedData.ano,
                        valor: formattedData.valor,
                        visualizar: formattedData.visualizar,
                        cpfUsuarioLogado: formattedData.cpfUsuarioLogado
                    })
                }
            } catch (error) {
                toast({
                    duration: 4000,
                    title: "Erro ao carregar mensalidade",
                    description: "Não foi possível carregar os dados da mensalidade.",
                });
            }
        }

        if (id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ id, reset, toast ]);


    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    const handleCancelar = () => {
        router.back(); // Volta para a página anterior
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
        const dadosAjustados = {
            ...data,
            dataMensalidade: `${data.dataMensalidade}T00:00:00.000Z`,
        };

        console.log(dadosAjustados)

        try {
            const response = await api.put(`/mensalidade?id=${id}`, dadosAjustados);

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Alteração de Mensalidade",
                    description: "Mensalidade atualizada com sucesso",
                })
            }
            console.log("Mensalidade atualizada com sucesso", response.data);
            router.push(`/private/mensalidades?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao atualizar mensalidade: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar mensalidade",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao atualizar mensalidade. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar mensalidade. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao atualizar atendimento. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar mensalidade. Erro inesperado",
                    description: error.message,
                })
            }
        }
    }

    return (
        <div className="text-slate-900 w-full h-auto flex justify-center items-start mt-16">
            <div className="flex flex-col items-center w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-1/2 mt-2">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="cpfUsuarioLogado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Vinculado ao C.P.F.</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={true}
                                                className="text-center w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <FormField
                                control={form.control}
                                name="ano"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Ano</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                className="text-center w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataMensalidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Data Mensalidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="date"
                                                name="dataMensalidade"
                                                className="w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Mês</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione o Mês" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="JANEIRO">Janeiro</SelectItem>
                                                    <SelectItem value="FEVEREIRO">Fevereiro</SelectItem>
                                                    <SelectItem value="MARCO">Março</SelectItem>
                                                    <SelectItem value="ABRIL">Abril</SelectItem>
                                                    <SelectItem value="MAIO">Maio</SelectItem>
                                                    <SelectItem value="JUNHO">Junho</SelectItem>
                                                    <SelectItem value="JULHO">Julho</SelectItem>
                                                    <SelectItem value="AGOSTO">Agosto</SelectItem>
                                                    <SelectItem value="SETEMBRO">Setembro</SelectItem>
                                                    <SelectItem value="OUTUBRO">Outubro</SelectItem>
                                                    <SelectItem value="NOVEMBRO">Novembro</SelectItem>
                                                    <SelectItem value="DEZEMBRO">Dezembro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <FormField
                                control={form.control}
                                name="valor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Valor</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="text-center w-full border p-2 bg-white text-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pago"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Pago</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione SIM / NÃO" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SIM">Sim</SelectItem>
                                                    <SelectItem value="NÃO">Não</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="visualizar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Visualizar</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full border p-2 bg-white text-black">
                                                    <SelectValue placeholder="Selecione SIM / NÃO" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SIM">Sim</SelectItem>
                                                    <SelectItem value="NÃO">Não</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>


                        <div className="grid grid-cols-3 gap-4 my-4">
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

