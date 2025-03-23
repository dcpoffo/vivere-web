"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import { format } from "date-fns";

export type MensalidadesData = {
    id: string;
    pago: string;
    dataMensalidade: Date;
    mes: string;
    ano: string;
    valor: number,
    visualizar: string;
    cpfUsuarioLogado: string;
};

export const columns: ColumnDef<MensalidadesData>[] = [
    {
        accessorKey: "actions",
        header: () => (
            <div >Alterar</div> // Alinhamento à esquerda para o cabeçalho 
        ),
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();
            const idPaciente = row.original.id; // Obtém o ID do paciente
            return (
                <Button
                    className="bg-transparent border-none"
                    variant="ghost"
                    onClick={() => router.push(`/private/mensalidades/edit/${idPaciente}`)}
                >
                    <Pencil color="red" size={16} />
                </Button>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => (
            <div>Id</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
    {
        accessorKey: "ano",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ano
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "mes",
        header: () => (
            <div>Mês Referência</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
    {
        accessorKey: "dataMensalidade",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const rawDate = row.getValue("dataMensalidade") as string;
            const date = new Date(rawDate);
            // Ajusta a data para o fuso horário local 
            const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            const formattedDate = localDate.toLocaleDateString("pt-BR"); // Formata a data no formato dd/MM/yyyy 

            return formattedDate;
        },
    },
    {
        accessorKey: "valor",
        header: "Valor",
        cell: ({ row }) => {
            const valor = parseFloat(row.getValue("valor"))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(valor)

            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: "pago",
        header: () => (
            <div>Pago</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
    {
        accessorKey: "visualizar",
        header: () => (
            <div>Visualizar</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
    {
        accessorKey: "cpfUsuarioLogado",
        header: () => (
            <div>C.P.F. Gerador</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
];