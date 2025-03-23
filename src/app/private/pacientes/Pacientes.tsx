"use client"

import { columns, PacientesData } from "@/app/datatable/pacientes/columns";
import DeniedPage from "@/app/denied/page";
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { Plus, RefreshCw } from "lucide-react"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pacientes() {

    const { pacienteSelecionado } = usePacienteContext();
    const [ loading, setLoading ] = useState(false);
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const [ pacientes, setPacientes ] = useState<PacientesData[]>([]); // Inicializado como array vazio


    const { data: session } = useSession();
    const api = useAPI();

    const fetchPacientes = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/pacientes`);
            const data = response.data;
            setPacientes(data);
        } catch (error) {
            console.error("Erro ao buscar pacientes: ", error);
            setPacientes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (id: string) => {
    };

    useEffect(() => {
        fetchPacientes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const search = searchParams.get("shouldUpdate");
        setShouldUpdate(search);

        if (search) {
            console.log("Parâmetro shouldUpdate detectado:", search);
            // Chame seu método de atualização
            atualizar().then(() => {
                // Remova o parâmetro shouldUpdate
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete("shouldUpdate");
                const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
                window.history.replaceState(null, "", newUrl);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchParams ]);

    const atualizar = async () => {
        const response = await api.get(`/pacientes`);
        const data = response.data;
        setPacientes(data);
    }

    const handleAtualizar = () => {
        console.log('atualizar')
    };

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-start items-center w-1/2 mt-16">
            <div className="flex gap-4 justify-end items-center">
                <Link href="/private/pacientes/new">
                    <Button
                        type="button"
                        className="px-4 py-2 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-500 flex items-center justify-center"
                    >
                        <Plus size={18} /> {/* Ajuste o tamanho do ícone */}
                    </Button>
                </Link>
                <Button
                    onClick={handleAtualizar}
                    className="px-4 py-2 h-12 bg-blue-600 text-white rounded-md hover:bg-blue-500 flex items-center justify-center"
                >
                    <RefreshCw size={18} /> {/* Ajuste o tamanho do ícone */}
                </Button>
            </div>

            {
                <div className="flex flex-col justify-center w-full container mx-auto mt-4">
                    <DataTable columns={columns} data={pacientes} onRowClick={handleRowClick} />
                </div>

            }
        </div>
    )
}