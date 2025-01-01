"use client";

import { useParams, useRouter } from "next/navigation";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAPI } from "@/service/API";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import DeniedPage from "@/app/denied/page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

type Atendimento = {
    dataAtendimento: string;
    observacao: string;
    atendimento: string;
    anotacoes?: string; // Opcional
};

export default function EditAtendimentoPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataAtendimento: new Date().toISOString().split('T')[ 0 ],
            observacao: "COMPARECEU",
            atendimento: "Pilates",
            anotacoes: "",
        }
    })

    const { id } = useParams(); // Captura o parâmetro da rota  
    const [ formData, setFormData ] = useState<Atendimento | null>(null);

    const api = useAPI();
    const { toast } = useToast()
    const router = useRouter();

    const { reset } = form;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/atendimento/id?id=${id}`);
                const fetchedData = response.data;

                if (fetchedData) {
                    const originalDate = new Date(fetchedData.dataAtendimento);

                    const adjustedDate = originalDate.toISOString().split("T")[ 0 ];

                    // Prepara os dados para o formulário
                    const formattedData = {
                        dataAtendimento: adjustedDate,
                        observacao: fetchedData.observacao,
                        atendimento: fetchedData.atendimento,
                        anotacoes: fetchedData.anotacoes || "",
                    };

                    form.reset({
                        observacao: formattedData.observacao,
                        atendimento: formattedData.atendimento,
                        anotacoes: formattedData.anotacoes || "",
                        dataAtendimento: adjustedDate
                    })
                }
            } catch (error) {
                toast({
                    duration: 4000,
                    title: "Erro ao carregar atendimento",
                    description: "Não foi possível carregar os dados do atendimento.",
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
        const dadosAjustados = {
            ...data,
            dataAtendimento: `${data.dataAtendimento}T00:00:00.000Z`,
        };

        console.log(dadosAjustados)

        try {
            const response = await api.put(`/atendimento?id=${id}`, dadosAjustados);

            if (response.data) {
                toast({
                    duration: 3000,
                    title: "Alteração de Atendimento",
                    description: "Atendimento atualizado com sucesso",
                })
            }
            console.log("Atendimento atualizado com sucesso", response.data);
            router.push(`/private/atendimentos?shouldUpdate=true`);

        } catch (error: any) {
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx                     
                console.error('Erro ao atualizar atendimento: ', error.response.data.message);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar atendimento",
                    description: error.response.data.message,
                })
                // Exibir a mensagem de erro para o usuário 
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta 
                console.error('Erro ao atualizar atendimento. Sem resposta do servidor', error.request);
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar atendimento. Sem resposta do servidor",
                    description: error.request,
                })
            } else {
                // Algo aconteceu ao configurar a requisição c
                console.error('Erro ao atualizar atendimento. Erro inesperado', error.message);
                // Exibir uma mensagem de erro genérica 
                toast({
                    duration: 4000,
                    variant: "destructive",
                    title: "Erro ao atualizar atendimento. Erro inesperado",
                    description: error.message,
                })
            }
        }
    }

    return (
        <div className="bg-slate-300 text-slate-900 w-full h-auto flex justify-center items-start">
            <div className="flex flex-col items-center bg-slate-300 w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Alterar Atendimento
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
                                                // value={
                                                //     formData?.dataAtendimento
                                                //         ? format(new Date(), "yyyy-MM-dd")
                                                //         : field.value
                                                // } // Formata para "yyyy-MM-dd"
                                                type="date"
                                                name="dataAtendimento"
                                                className="w-full border p-2 bg-white text-black"
                                                onChange={(e) => field.onChange(e.target.value)} // Atualiza o valor do formulário
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
                                            <Select
                                                {...field}
                                                value={field.value}
                                                //defaultValue="COMPARECEU"
                                                onValueChange={field.onChange}>
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
                                            <Select
                                                {...field}
                                                value={field.value}
                                                //defaultValue="Pilates"
                                                onValueChange={field.onChange}>
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
                                            //value={formData?.anotacoes || ""}
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
