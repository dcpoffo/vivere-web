"use client";

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
import { columns, MensalidadesData } from "@/app/datatable/mensalidades/columns";

// Cache local fora do ciclo de vida do React
const mensalidadesCache: Record<string, MensalidadesData[]> = {};

export default function Mensalidades() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const api = useAPI();
    const { data: session } = useSession();
    const { pacienteSelecionado } = usePacienteContext();
    const [ selectedId, setSelectedId ] = useState<string | null>(null);

    const [ formData, setFormData ] = useState({
        id: "",
        pago: "",
        dataMensalidade: "",
        mes: "",
        ano: "",
        valor: "",
        visualizar: "",
        cpfUsuarioLogado: "",
    });

    const [ mensalidades, setMensalidades ] = useState<MensalidadesData[]>([]); // Inicializado como array vazio
    const [ loading, setLoading ] = useState(false);

    const handleRowClick = (id: string) => {
        const selectedRow = mensalidades.find((row) => row.id === id);
        if (selectedRow) {
            setSelectedId(selectedRow.id);
            setFormData({
                id: selectedRow.id,
                pago: selectedRow.pago,
                dataMensalidade: new Date(selectedRow.dataMensalidade).toISOString(),
                mes: selectedRow.mes,
                ano: selectedRow.ano,
                valor: selectedRow.valor.toString(),
                visualizar: selectedRow.visualizar,
                cpfUsuarioLogado: selectedRow.cpfUsuarioLogado,
            });
        }

        console.log(formData)
    };


    const atualizar = async () => {
        if (pacienteSelecionado?.id) {

            const response = await api.get(`/mensalidade?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;

            mensalidadesCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setMensalidades(data);
        }
    }

    const fetchMensalidades = async () => {
        if (!pacienteSelecionado?.id) return;

        setLoading(true);
        try {
            console.log("Buscando mensalidades na API para o paciente:", pacienteSelecionado.id);

            if (mensalidadesCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para mensalidades:", pacienteSelecionado.id);
                setMensalidades(mensalidadesCache[ pacienteSelecionado.id ]);
            } else {
                const response = await api.get(`/mensalidade?idPaciente=${pacienteSelecionado.id}`);
                const data = response.data;

                mensalidadesCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
                setMensalidades(data);
            }
        } catch (error) {
            console.error("Erro ao buscar mensalidades: ", error);
            setMensalidades([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMensalidades();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pacienteSelecionado?.id ]);

    useEffect(() => {
        const search = searchParams.get('shouldUpdate')
        console.log(search);
        if (search) {
            atualizar().then(() => {
                // Remover o parâmetro shouldUpdate da URL após a atualização
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('shouldUpdate');
                const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
                window.history.replaceState(null, '', newUrl);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchParams ]);


    const handleAtualizar = () => {
        if (pacienteSelecionado?.id) {
            delete mensalidadesCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchMensalidades(); // Força nova busca
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
        <div className="flex flex-col justify-start items-center w-full">
            <div className="flex gap-4 justify-end items-center">
                <Link href="/private/mensalidades/new">
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

            {/* Quantidade de atendimentos */}
            {
                !loading && (
                    <p className="mt-4 text-gray-700">
                        Quantidade de mensalidades geradas para
                        <span className="font-bold"> {pacienteSelecionado?.nome}</span>
                        : {mensalidades?.length ?? 0}
                    </p>
                )
            }

            {loading && <p>Carregando mensalidades...</p>}

            {
                !loading && mensalidades.length === 0 && (
                    <p className="mt-4 text-gray-500">
                        O paciente selecionado não possui mensalidades cadastrados.
                    </p>
                )
            }

            {
                !loading && mensalidades.length > 0 && (
                    <div className="flex flex-col justify-center w-full container mx-auto mt-4">
                        <DataTable columns={columns} data={mensalidades} onRowClick={handleRowClick} />
                    </div>
                )
            }
        </div >
    );
}


