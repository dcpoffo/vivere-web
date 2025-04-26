"use client"

import DeniedPage from "@/app/denied/page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePacienteContext } from "@/context/PacienteContext";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/service/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { format } from "date-fns";

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
        .regex(/^\d+(,\d{1,2})?$/, { message: "O valor deve estar no formato 1234,56" })
        .transform((val) => Number(val.replace(",", ".")))
        .refine((val) => val > 0, { message: "O valor deve ser maior que zero" })

})

export default function NovaMensalidade() {

    const { data: session } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataMensalidade: format(new Date(), "yyyy-MM-dd"),
            pago: "SIM",
            mes: getMonthName(new Date().getMonth() + 1),
            ano: new Date().getFullYear().toString(),
            valor: 0,
            visualizar: "SIM",
            cpfUsuarioLogado: session?.user.cpf || ""
        }
    })

    const { pacienteSelecionado } = usePacienteContext();
    const router = useRouter();
    const api = useAPI();
    const { toast } = useToast()
    const { reset } = form;
    // const { reset } = useForm<z.infer<typeof formSchema>>();

    function getMonthName(monthNumber: number): "JANEIRO" | "FEVEREIRO" | "MARÇO" | "ABRIL" | "MAIO" | "JUNHO" | "JULHO" | "AGOSTO" | "SETEMBRO" | "OUTUBRO" | "NOVEMBRO" | "DEZEMBRO" {
        const months = [ "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO" ] as const;
        return months[ monthNumber - 1 ];
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const dadosAjustados = {
            ...data,
            dataMensalidade: `${data.dataMensalidade}T00:00:00.000Z`,
        };

        console.log(dadosAjustados)

        try {
            const response = await api.post("/mensalidade", {
                idPaciente: pacienteSelecionado?.id,
                dataMensalidade: dadosAjustados.dataMensalidade,
                pago: dadosAjustados.pago,
                mes: dadosAjustados.mes,
                ano: dadosAjustados.ano,
                valor: dadosAjustados.valor,
                visualizar: dadosAjustados.visualizar,
                cpfUsuarioLogado: dadosAjustados.cpfUsuarioLogado
            });

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Cadastro de Mensalidade",
                    description: "Mensalidade cadastrada com sucesso",
                })
            }
            console.log("Mensalidade cadastrada com sucesso", response.data);
            router.push(`/private/mensalidades?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                console.error('Erro ao cadastrar mensalidade: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar mensalidade",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro ao cadastrar mensalidade. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar mensalidade. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao cadastrar mensalidade. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao cadastrar mensalidade. Erro inesperado",
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
        <div className="text-slate-900 w-full h-auto flex justify-center items-start mt-16">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl font-bold mt-1">
                    Nova Mensalidade
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-1/2">
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <FormField
                                control={form.control}
                                name="cpfUsuarioLogado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="col-span-1 font-semibold">Vinculado ao C.P.F.</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                // disabled={true}
                                                readOnly
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
                                                min="1900"
                                                max="2099"
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
                                                    <SelectItem value="MARÇO">Março</SelectItem>
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