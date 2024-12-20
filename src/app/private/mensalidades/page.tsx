"use client";

import { columns, MensalidadesData } from "@/app/datatable/mensalidades/columns";
import { DataTable } from "@/components/ui/data-table";
import { usePacienteContext } from "@/context/PacienteContext";
import { useAPI } from "@/service/API";
import { useEffect, useState } from "react";

// Cache local fora do ciclo de vida do React
const mensalidadesCache: Record<string, MensalidadesData[]> = {};

export default function Mensalidades() {
  const api = useAPI();
  const { pacienteSelecionado } = usePacienteContext();

  const [ mensalidades, setMensalidades ] = useState<MensalidadesData[]>([]); // Inicializado como array vazio
  const [ loading, setLoading ] = useState(false);

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
  }, [ pacienteSelecionado ]);

  const handleAtualizar = () => {
    if (pacienteSelecionado?.id) {
      delete mensalidadesCache[ pacienteSelecionado.id ]; // Invalida o cache
      fetchMensalidades(); // Força nova busca
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <button
        onClick={handleAtualizar}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Atualizar Mensalidades
      </button>

      {/* Quantidade de atendimentos */}
      {!loading && (
        <p className="mt-4 text-gray-700">
          Quantidade de mensalidades cadastradas: {mensalidades?.length ?? 0}
        </p>
      )}

      {loading && <p>Carregando mensalidades...</p>}

      {!loading && mensalidades.length === 0 && (
        <p className="mt-4 text-gray-500">
          O paciente selecionado não possui mensalidades cadastrados.
        </p>
      )}

      {!loading && mensalidades.length > 0 && (
        <div className="flex flex-col justify-center w-full container mx-auto py-10">
          <DataTable columns={columns} data={mensalidades} />
        </div>
      )}
    </div>
  );
}
