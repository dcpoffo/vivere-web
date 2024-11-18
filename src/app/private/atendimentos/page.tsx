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

    const [ atendimentos, setAtendimentos ] = useState<AtendimentosData[]>([]); // Dados carregados
    const [ loading, setLoading ] = useState(false); // Estado de carregamento

    const fetchAtendimentos = useCallback(async () => {
        if (!pacienteSelecionado) return;

        setLoading(true);
        try {
            console.log("Buscando atendimentos na API...");
            const response = await api.get(`/atendimento?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;
            atendimentosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setAtendimentos(data);
            console.log(data);
        } catch (error) {
            console.error("Erro ao buscar atendimentos: ", error);
        } finally {
            setLoading(false);
        }
    }, [ api, pacienteSelecionado ]);

    useEffect(() => {
        if (pacienteSelecionado?.id) {
            if (atendimentosCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para atendimentos:", pacienteSelecionado.id);
                setAtendimentos(atendimentosCache[ pacienteSelecionado.id ]);
            } else {
                fetchAtendimentos();
            }
        }
    }, [ pacienteSelecionado, fetchAtendimentos ]);

    const handleAtualizar = () => {
        // Invalida o cache e força a atualização
        if (pacienteSelecionado?.id) {
            delete atendimentosCache[ pacienteSelecionado.id ];
            fetchAtendimentos();
        }
    };

    return (
        <div className="flex flex-col justify-start items-center w-full">
            {/* <TabsPaciente /> */}
            <button
                onClick={handleAtualizar}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Atualizar Atendimentos
            </button>
            {loading && <p>Carregando atendimentos...</p>}

            {!loading && atendimentos.length > 0 && (
                <div className="flex flex-col justify-center w-full container mx-auto py-10">
                    {/* <h2>Atendimentos do paciente:</h2> */}
                    {/* <pre>{JSON.stringify(atendimentos, null, 2)}</pre> */}
                    <DataTable columns={columns} data={atendimentos} />
                </div>
            )}

        </div>
    );
}

// useEffect(() => {
//     if (pacienteSelecionado?.id) {
//         // Verifica se o paciente já está no cache
//         if (atendimentosCache[ pacienteSelecionado.id ]) {
//             console.log("Usando cache para atendimentos:", pacienteSelecionado.id);
//             setAtendimentos(atendimentosCache[ pacienteSelecionado.id ]);
//         } else {
//             fetchAtendimentos();
//         }
//     }
// }, [ pacienteSelecionado?.id ]);


// const fetchAtendimentos = async () => {
//     if (!pacienteSelecionado) return;

//     setLoading(true);
//     try {
//         console.log("Buscando atendimentos na API...");
//         const response = await api.get(`/atendimento?idPaciente=${pacienteSelecionado?.id}`);
//         const data = response.data;
//         atendimentosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
//         setAtendimentos(data);
//         console.log(data);
//     } catch (error) {
//         console.error("Erro ao buscar atendimentos: ", error);
//     } finally {
//         setLoading(false);
//     }
// };
