"use client";

import { AtendimentosData, columns } from "@/app/datatable/atendimentos/columns";
import { DataTable } from "@/components/ui/data-table";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { useEffect, useState } from "react";

// Cache local fora do ciclo de vida do React
const atendimentosCache: Record<string, AtendimentosData[]> = {};

export default function Atendimentos() {
    const api = useAPI();
    const { pacienteSelecionado } = usePacienteContext();

    const [ atendimentos, setAtendimentos ] = useState<AtendimentosData[]>([]); // Inicializado como array vazio
    const [ loading, setLoading ] = useState(false);

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
    }, [ pacienteSelecionado ]);

    const handleAtualizar = () => {
        if (pacienteSelecionado?.id) {
            delete atendimentosCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchAtendimentos(); // Força nova busca
        }
    };

    return (
        <div className="flex flex-col justify-start items-center w-full">
            <button
                onClick={handleAtualizar}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Atualizar Atendimentos
            </button>

            {/* Quantidade de atendimentos */}
            {!loading && (
                <p className="mt-4 text-gray-700">
                    Quantidade de atendimentos realizados: {atendimentos?.length ?? 0}
                </p>
            )}

            {loading && <p>Carregando atendimentos...</p>}

            {!loading && atendimentos.length === 0 && (
                <p className="mt-4 text-gray-500">
                    O paciente selecionado não possui atendimentos cadastrados.
                </p>
            )}

            {!loading && atendimentos.length > 0 && (
                <div className="flex flex-col justify-center w-full container mx-auto py-10">
                    <DataTable columns={columns} data={atendimentos} />
                </div>
            )}
        </div>
    );
}
