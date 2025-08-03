"use client"
import { columns, OsteopatiasData } from "@/app/datatable/osteopatias/columns";
import DeniedPage from "@/app/denied/page";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const OsteopatiasCache: Record<string, OsteopatiasData[]> = {};

export default function Osteopatias() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);
    const router = useRouter();
    const api = useAPI();
    const { pacienteSelecionado } = usePacienteContext();
    const [ selectedId, setSelectedId ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ osteopatias, setOsteopatias ] = useState<OsteopatiasData[]>([]); // Inicializado como array vazio

    useEffect(() => {
        fetchOsteopatias();
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

    const atualizar = async () => {
        if (pacienteSelecionado?.id) {

            const response = await api.get(`/osteopatia?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;

            OsteopatiasCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setOsteopatias(data);
        }
    }

    const fetchOsteopatias = async () => {
        if (!pacienteSelecionado?.id) return;

        setLoading(true);
        try {
            console.log("Buscando osteopatias na API para o paciente:", pacienteSelecionado.id);

            if (OsteopatiasCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para osteopatias:", pacienteSelecionado.id);
                setOsteopatias(OsteopatiasCache[ pacienteSelecionado.id ]);
            } else {
                const response = await api.get(`/osteopatia?idPaciente=${pacienteSelecionado.id}`);
                const data = response.data;

                OsteopatiasCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
                setOsteopatias(data);
            }
        } catch (error) {
            console.error("Erro ao buscar osteopatias: ", error);
            setOsteopatias([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNovo = () => {
        router.push("/private/osteopatias/new"); // Volta para a página anterior
    };

    const handleAtualizar = () => {
        if (pacienteSelecionado?.id) {
            delete OsteopatiasCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchOsteopatias(); // Força nova busca
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
        <div className="flex flex-col justify-start items-center w-full mt-16">
            <div className="flex gap-4 justify-center items-center my-4 w-1/3">
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


            {loading && <p>Carregando Sessões de Osteopatia...</p>}

            {
                !loading && osteopatias.length === 0 && (
                    <p className="mt-4 text-black">
                        O paciente selecionado não possui sessões cadastrados.
                    </p>
                )
            }

            {
                !loading && osteopatias.length > 0 && (
                    <div className="flex flex-col justify-center w-full container mx-auto">
                        <DataTable
                            columns={columns}
                            data={osteopatias}
                            showSearch={false} />
                    </div>
                )
            }
        </div >

    )
}
