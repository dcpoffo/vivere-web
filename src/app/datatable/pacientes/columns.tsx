"use client"

import { Button } from "@/components/ui/button";
import { usePacienteContext } from "@/context/PacienteContext";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { ArrowUpDown, Frown, Meh, Pencil, PenOff, Smile, ThumbsDown, ThumbsDownIcon, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

export type PacientesData = {
    id: string,
    nome: string,
    cpf: string,
    contato1: string,
    contato2: string,
    dataNascimento: Date,
    endereco: string,
    email: string,
    situacao: string,
    profissao: string,
};


export const columns: ColumnDef<PacientesData>[] = [
    {
        accessorKey: "actions",
        header: () => (
            <div className="text-center">Alterar/Selecionar</div> // Alinhamento à esquerda para o cabeçalho
        ),
        cell: ({ row }) => {

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { selecionarPaciente, pacienteSelecionado, limparPacienteSelecionado } = usePacienteContext(); // Use o contexto
            const paciente = row.original;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();
            const idPaciente = row.original.id; // Obtém o ID do paciente
            return (
                <>
                    <div className="flex items-center justify-center">
                        <Button
                            className="bg-transparent border-none"
                            variant="ghost"
                            disabled={pacienteSelecionado?.id != idPaciente}
                            onClick={() => router.push(`/private/pacientes/edit/${idPaciente}`)}
                        >
                            {pacienteSelecionado?.id === idPaciente
                                ? (<Pencil color="green" size={16} />)
                                : (<PenOff color="red" size={16} />)

                            }
                        </Button>

                        <Button
                            className="bg-transparent border-none"
                            variant="ghost"
                            onClick={() => {
                                if (pacienteSelecionado?.id === idPaciente) {
                                    limparPacienteSelecionado(); // Desseleciona se já está selecionado
                                } else {
                                    selecionarPaciente(paciente); // Seleciona o paciente
                                }
                            }}
                        >
                            {pacienteSelecionado?.id != idPaciente ? (
                                <ThumbsDown color="red" size={16} /> // Ícone se o paciente está selecionado
                            ) : (
                                <ThumbsUp color="green" size={16} /> // Ícone se o paciente não está selecionado
                            )}
                        </Button>
                    </div>
                </>
            );
        },
    },

    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div>Id</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: (cell) => {
            const value = cell.getValue<string>()
            return (
                <div className="flex justify-center w-16">{value}</div> // Alinhamento à esquerda para o cabeçalho 
            )
        }
    },
    {
        accessorKey: "nome",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center">Nome</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "situacao",
        header: () => (
            <div className="text-center">Situação</div> // Alinhamento à esquerda para o cabeçalho 
        ),
        cell: ({ cell, column }) => {
            const value = cell.getValue<string>()
            return (
                <div className="flex justify-center items-center">
                    {value === "ATIVO" ? <Smile color="green" /> : <Meh color="red" />}
                </div>
            )
        }
    },
];