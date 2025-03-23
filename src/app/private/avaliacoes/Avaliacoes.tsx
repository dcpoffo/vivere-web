"use client";

import { AvaliacoesData, columns } from "@/app/datatable/avaliacoes/columns";
import DeniedPage from "@/app/denied/page";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { Plus, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Cache local fora do ciclo de vida do React
const avaliacoesCache: Record<string, AvaliacoesData[]> = {};

export default function Avaliacoes() {
    const searchParams = useSearchParams();
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);

    const router = useRouter();
    const api = useAPI();
    const { data: session } = useSession();
    const { pacienteSelecionado } = usePacienteContext();
    const [ selectedId, setSelectedId ] = useState<string | null>(null);

    const [ avaliacoes, setAvaliacoes ] = useState<AvaliacoesData[]>([]); // Inicializado como array vazio
    const [ loading, setLoading ] = useState(false);

    const atualizar = async () => {
        if (pacienteSelecionado?.id) {

            const response = await api.get(`/avaliacao?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;

            avaliacoesCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setAvaliacoes(data);
        }
    }

    const fetchAvaliacoes = async () => {
        if (!pacienteSelecionado?.id) return;

        setLoading(true);
        try {
            console.log("Buscando Avaliações na API para o paciente:", pacienteSelecionado.id);

            if (avaliacoesCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para avaliacoes:", pacienteSelecionado.id);
                setAvaliacoes(avaliacoesCache[ pacienteSelecionado.id ]);
            } else {
                const response = await api.get(`/avaliacao?idPaciente=${pacienteSelecionado.id}`);
                const data = response.data;

                avaliacoesCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
                setAvaliacoes(data);
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações: ", error);
            setAvaliacoes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvaliacoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pacienteSelecionado?.id ]);

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


    const handleAtualizar = () => {
        if (pacienteSelecionado?.id) {
            delete avaliacoesCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchAvaliacoes(); // Força nova busca
        }
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
                <Link href="/private/avaliacoes/new">
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

            {loading && <p>Carregando avaliações...</p>}

            {
                !loading && avaliacoes.length === 0 && (
                    <p className="mt-4 text-gray-500">
                        O paciente selecionado não possui avaliações cadastradas.
                    </p>
                )
            }

            {
                !loading && avaliacoes.length > 0 && (
                    <div className="flex flex-col justify-center w-full container mx-auto mt-4">
                        <DataTable columns={columns} data={avaliacoes} showSearch={false} />
                    </div>
                )
            }
        </div >
    );
}