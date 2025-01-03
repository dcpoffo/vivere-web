"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "./button"
import { CircleArrowLeft, CircleArrowRight } from "lucide-react"
import { useState } from "react"

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (id: string) => void; // Adiciona um parâmetro para a função de clique na linha
    showSearch?: boolean;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    onRowClick, // Recebe a função de clique na linha
    showSearch = true,
}: DataTableProps<TData, TValue>) {
    const [ sorting, setSorting ] = useState<SortingState>([]);
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <>
            {/* Exibe o campo de pesquisa apenas quando showSearch for true */}
            {showSearch && (
                <div className="flex items-center pb-4">
                    <Input
                        placeholder="Filtrar pelo nome do paciente..."
                        value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("nome")?.setFilterValue(event.target.value)
                        }
                        className="flex w-full border-gray-700"
                    />
                </div>
            )}


            <div className="rounded-md border border-gray-700 w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original.id)} // Chama a função onRowClick com o id da linha
                                    style={{ cursor: "pointer" }} // Para indicar que a linha é clicável
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <CircleArrowLeft />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <CircleArrowRight />
                </Button>
            </div>

        </>
    );
}
