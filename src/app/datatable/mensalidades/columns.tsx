"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
        header: "Mês referência",
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
        cell: ({ cell }) => {
            const rawValue = cell.getValue<string>(); // Obtém o valor bruto
            const formattedDate = new Date(rawValue).toLocaleDateString("pt-BR");
            return <span>{formattedDate}</span>;
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
        header: "Pago",
    },
    {
        accessorKey: "visualizar",
        header: "Visualizar",
    },
    {
        accessorKey: "cpfUsuarioLogado",
        header: "C.P.F. gerador",
    },
];