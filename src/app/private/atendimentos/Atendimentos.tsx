"use client";

import { AtendimentosData, columns } from "@/app/datatable/atendimentos/columns";
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
const atendimentosCache: Record<string, AtendimentosData[]> = {};

export default function Atendimentos() {
    const searchParams = useSearchParams();
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);

    const router = useRouter();
    const api = useAPI();
    const { data: session } = useSession();
    const { pacienteSelecionado } = usePacienteContext();
    const [ selectedId, setSelectedId ] = useState<string | null>(null);

    const [ formData, setFormData ] = useState({
        id: "",
        dataAtendimento: "",
        observacao: "",
        anotacoes: "",
        atendimento: ""
    });

    const [ atendimentos, setAtendimentos ] = useState<AtendimentosData[]>([]); // Inicializado como array vazio
    const [ loading, setLoading ] = useState(false);

    const atualizar = async () => {
        if (pacienteSelecionado?.id) {

            const response = await api.get(`/atendimento?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;

            atendimentosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setAtendimentos(data);
        }
    }

    const fetchAtendimentos = async () => {
        if (!pacienteSelecionado?.id) return;

        setLoading(true);
        try {
            console.log("Buscando atendimentos na API para o paciente:", pacienteSelecionado.id);

            if (atendimentosCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para atendimentos:", pacienteSelecionado.id);
                setAtendimentos(atendimentosCache[ pacienteSelecionado.id ]);
            } else {
                const response = await api.get(`/atendimento?idPaciente=${pacienteSelecionado.id}`);
                const data = response.data;

                atendimentosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
                setAtendimentos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar atendimentos: ", error);
            setAtendimentos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAtendimentos();
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
            delete atendimentosCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchAtendimentos(); // Força nova busca
        }
    };

    const handleNovo = () => {
        router.push("/private/atendimentos/new"); // Volta para a página anterior
    };

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-start items-center w-full mt-16">
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

            {loading && <p>Carregando atendimentos...</p>}

            {
                !loading && atendimentos.length === 0 && (
                    <p className="mt-4 text-gray-500">
                        O paciente selecionado não possui atendimentos cadastrados.
                    </p>
                )
            }

            {
                !loading && atendimentos.length > 0 && (
                    <div className="flex flex-col justify-center w-full container mx-auto">
                        <DataTable columns={columns} data={atendimentos} showSearch={false} />
                    </div>
                )
            }
        </div >
    );
}