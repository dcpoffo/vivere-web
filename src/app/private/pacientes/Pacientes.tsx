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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pacientes() {

    const { pacienteSelecionado } = usePacienteContext();
    const [ loading, setLoading ] = useState(false);
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const [ pacientes, setPacientes ] = useState<PacientesData[]>([]); // Inicializado como array vazio

    const { data: session } = useSession();
    const api = useAPI();
    const router = useRouter();

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
        console.log(id)
        //pacienteSelecionado?.id == id
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

    const handleNovo = () => {
        router.push("/private/pacientes/new"); // Volta para a página anterior
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
            <div className="flex gap-4 justify-end items-center my-4">
                <Button
                    type="button"
                    className="flex items-center justify-center bg-roxoEscuro hover:bg-roxoClaro w-32"
                    onClick={handleNovo}
                >
                    Novo
                </Button>

                <Button
                    type="button"
                    className="flex items-center justify-center bg-roxoEscuro hover:bg-roxoClaro w-32"
                    onClick={handleAtualizar}
                >
                    Atualizar
                </Button>
            </div>

            {
                <div className="flex flex-col justify-center w-full container mx-auto">
                    <DataTable columns={columns} data={pacientes} onRowClick={handleRowClick} />
                </div>

            }
        </div>
    )
}