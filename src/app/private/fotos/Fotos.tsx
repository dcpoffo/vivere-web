"use client"

import DeniedPage from "@/app/denied/page";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, View, ZoomIn } from "lucide-react";
import Link from "next/link";
import { parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Fotos() {

    const [ formData, setFormData ] = useState({
        id: "",
        dataFoto: "",
        caminho: ""
    })

    type FotosData = {
        id: string,
        dataFoto: Date,
        caminho: string
    }

    const searchParams = useSearchParams();
    const [ shouldUpdate, setShouldUpdate ] = useState<string | null>(null);
    const [ fotos, setFotos ] = useState<FotosData[]>([]); // Inicializado como array vazio
    const [ loading, setLoading ] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const { pacienteSelecionado } = usePacienteContext();

    const fotosCache: Record<string, FotosData[]> = {};

    const api = useAPI();

    const fetchFotos = async () => {
        if (!pacienteSelecionado?.id) return;

        setLoading(true);
        try {
            console.log("Buscando fotos na API para o paciente:", pacienteSelecionado.id);

            if (fotosCache[ pacienteSelecionado.id ]) {
                console.log("Usando cache para fotos:", pacienteSelecionado.id);
                setFotos(fotosCache[ pacienteSelecionado.id ]);
            } else {
                const response = await api.get(`/foto?idPaciente=${pacienteSelecionado.id}`);
                const data = response.data;

                fotosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
                setFotos(data);
                console.log(data)
            }
        } catch (error) {
            console.error("Erro ao buscar fotos: ", error);
            setFotos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNovo = () => {
        router.push("/private/fotos/new");
    }

    const atualizar = async () => {
        if (pacienteSelecionado?.id) {

            const response = await api.get(`/foto?idPaciente=${pacienteSelecionado.id}`);
            const data = response.data;

            fotosCache[ pacienteSelecionado.id ] = data; // Atualiza o cache
            setFotos(data);
        }
    }

    useEffect(() => {
        fetchFotos();
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

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    const handleAtualizar = () => {
        if (pacienteSelecionado?.id) {
            delete fotosCache[ pacienteSelecionado.id ]; // Invalida o cache
            fetchFotos(); // Força nova busca
        }
    };

    return (
        <div className="flex flex-col justify-start items-center w-2/3 mt-16 min-w-80">
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

            {/* <div className="flex gap-4 justify-end items-center "> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mb-4">
                {fotos.map((foto) => (

                    <div
                        key={foto.id}
                        className="border rounded-xl shadow-md p-2 flex flex-col items-center justify-center bg-white"
                    >
                        <div className="flex items-center justify-between gap-2 text-sm text-gray-700">
                            {foto.dataFoto && format(new Date(foto.dataFoto + "T00:00:00"), 'dd/MM/yyyy', { locale: ptBR })}
                            <Link
                                href={`/private/fotos/edit/${foto.id}`}
                                className="text-roxoEscuro hover:text-roxoClaro "
                            >
                                <Pencil size={14} />
                            </Link>

                            <Link
                                href={foto.caminho}
                                className="text-roxoEscuro hover:text-roxoClaro" target="_blank">
                                <Eye size={14} />
                            </Link>
                        </div>


                        <Image
                            src={foto.caminho}
                            alt={`Foto ${foto.id}`}
                            width={300}
                            height={200}
                            className="rounded-md object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/erro.png";
                            }}
                        />
                    </div>
                ))}
            </div>
            {/* </div> */}
        </div>
    )
}