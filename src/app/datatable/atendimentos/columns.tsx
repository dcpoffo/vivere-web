"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseISO, format, startOfDay } from 'date-fns';

export type AtendimentosData = {
    id: string;
    dataAtendimento: Date;
    observacao: string;
    anotacoes: string;
    atendimento: string;
};

export const columns: ColumnDef<AtendimentosData>[] = [
    {
        accessorKey: "actions",
        header: () => (
            <div>Alterar</div> // Alinhamento à esquerda para o cabeçalho
        ),
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();
            const idPaciente = row.original.id; // Obtém o ID do paciente
            return (
                <Button
                    className="bg-transparent border-none"
                    variant="ghost"
                    onClick={() => router.push(`/private/atendimentos/edit/${idPaciente}`)}
                >
                    <Pencil color="red" size={16} />
                </Button>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => (
            <div className="text-center">Id</div> // Alinhamento à esquerda para o cabeçalho
        ),
    },
    {
        accessorKey: "dataAtendimento",
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
        cell: ({ cell, column }) => {
            const value = cell.getValue<string>(); // Obtém o valor bruto
            const parsedDate = parseISO(value); // Converte a string para um objeto Date

            // Ajusta para UTC (mesmo dia, sem mudanças de fuso horário)
            const utcDate = new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate());

            const formattedDate = format(utcDate, 'dd/MM/yyyy'); // Formata a data no formato desejado
            return (
                <span>{formattedDate}</span>
            );
        },
    },
    {
        accessorKey: "observacao",
        header: "Observação",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div> // Alinhamento à esquerda
        ),
    },
    {
        accessorKey: "anotacoes",
        header: "Anotações",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div>
        ),
    },
    {
        accessorKey: "atendimento",
        header: "Atendimento",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div>
        ),
    },
];