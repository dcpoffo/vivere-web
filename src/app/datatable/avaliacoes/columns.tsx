"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseISO, format, startOfDay } from 'date-fns';

export type AvaliacoesData = {
    id: string;
    indicacao: string;
    queixaPrincipal: string;
    objetivoPrincipal: string;
};

export const columns: ColumnDef<AvaliacoesData>[] = [
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
                    onClick={() => router.push(`/private/avaliacoes/edit/${idPaciente}`)}
                >
                    <Pencil color="red" size={16} />
                </Button>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => (
            <div >Id</div> // Alinhamento à esquerda para o cabeçalho 
        ),
    },
    {
        accessorKey: "indicacao",
        header: "Indicação",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div> // Alinhamento à esquerda 
        ),
    },
    {
        accessorKey: "queixaPrincipal",
        header: "Queixa principal",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div>
        ),
    },
    {
        accessorKey: "objetivoPrincipal",
        header: "Objetivo principal",
        cell: ({ cell }) => (
            <div className="text-left">{cell.getValue<string>()}</div>
        ),
    },
];