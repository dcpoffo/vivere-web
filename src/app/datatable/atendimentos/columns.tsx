"use client"

import { ColumnDef } from "@tanstack/react-table";

export type AtendimentosData = {
    id: string;
    // data: Date;
    dataAtendimento: Date;
    observacao: string;
    anotacoes: string;
    atendimento: string;
};

export const columns: ColumnDef<AtendimentosData>[] = [
    {
        accessorKey: "dataAtendimento",
        header: "Data",
        cell: ({ cell }) => {
            const rawValue = cell.getValue<string>(); // Obtém o valor bruto
            const formattedDate = new Date(rawValue).toLocaleDateString("pt-BR");
            return <span>{formattedDate}</span>;
        },
    },
    {
        accessorKey: "observacao",
        header: "Observação",
    },
    {
        accessorKey: "anotacoes",
        header: "Anotações",
    },
    {
        accessorKey: "atendimento",
        header: "Atendimento",
    },
];

// id              Int @id @default (autoincrement())
//   idPaciente      Int
//   dataAtendimento DateTime ? @db.Date
//   observacao      String ? @db.VarChar(17)
//   anotacoes       String ? @db.VarChar(10000)
//   atendimento     String @default ("Pilates") @db.VarChar(25)
//   paciente        Paciente @relation(fields: [ idPaciente ], references: [ id ])