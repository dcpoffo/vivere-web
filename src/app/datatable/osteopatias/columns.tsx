
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type OsteopatiasData = {
    id: string;
    dataAvaliacao: Date;
    queixaPrincipal: string;
}

export const columns: ColumnDef<OsteopatiasData>[] = [
    {
        accessorKey: "actions",
        header: () => (
            <div >Alterar</div> // Alinhamento à esquerda para o cabeçalho
        ),
        cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();
            const id = row.original.id; // Obtém o ID do paciente
            return (
                <Button
                    className="bg-transparent border-none"
                    variant="ghost"
                    onClick={() => router.push(`/private/osteopatias/edit/${id}`)}
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
        accessorKey: "dataAvaliacao",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data Avaliação
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const rawDate = row.getValue("dataAvaliacao") as string;
            const date = new Date(rawDate);
            // Ajusta a data para o fuso horário local
            const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            const formattedDate = localDate.toLocaleDateString("pt-BR"); // Formata a data no formato dd/MM/yyyy

            return <div className="text-center w-36">{formattedDate}</div>; // <<< Aqui
        },
    },
    {
        accessorKey: "queixaPrincipal",
        header: () => <div className="min-w-[600px]">Queixa Principal</div>,
        cell: ({ row }) => (
            <div className="min-w-[600px]">{row.getValue("queixaPrincipal")}</div>
        ),
    }
];