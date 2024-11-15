"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CadastroTab from '@/components/tabs/cadastro';
import MensalidadeTab from '@/components/tabs/mensalidade';
import AtendimentoTab from '@/components/tabs/atendimento';
import { usePacienteContext } from '@/context/PacienteContext';
import { Paciente } from '@/types/Paciente';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TabsPaciente() {
    const { pacienteSelecionado, selecionarPaciente } = usePacienteContext();
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const [ editando, setEditando ] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setDadosPaciente(pacienteSelecionado);
    }, [ pacienteSelecionado ]);

    const handleTabChange = (value: string) => {
        if (value === "mensalidades" && dadosPaciente) {
            router.push(`/private/mensalidades?idAluno=${dadosPaciente.id}`);
        } else if (value === "atendimentos") {
            router.push('/private/atendimentos');
        }
        // Não precisa redirecionar para 'cadastro' aqui, pois ele já está na página atual.
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dadosPaciente) {
            try {
                // Implementar a lógica de salvamento dos dados do paciente aqui
                selecionarPaciente(dadosPaciente);
                setEditando(false);
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (dadosPaciente) {
            const { name, value } = e.target;
            setDadosPaciente(prev => ({ ...prev!, [ name ]: value }));
        }
    };

    const handleAlterar = () => {
        setEditando(true);
    };

    const handleCancelar = () => {
        setEditando(false);
        setDadosPaciente(pacienteSelecionado); // Para restaurar os dados originais
    };

    return (
        <Tabs
            value={pathname.includes("mensalidades") ? "mensalidades" : pathname.includes("atendimentos") ? "atendimentos" : "cadastro"}
            onValueChange={handleTabChange}
        >
            {dadosPaciente && (
                <TabsList className="inline-flex">
                    <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
                    <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
                    <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
                </TabsList>
            )}

            <TabsContent value="cadastro">
                <CadastroTab
                    dadosPaciente={dadosPaciente}
                    editando={editando}
                    handleSalvar={handleSalvar}
                    handleChange={handleChange}
                    handleAlterar={handleAlterar}
                    handleCancelar={handleCancelar}
                />
            </TabsContent>

            <TabsContent value="mensalidades">
                <MensalidadeTab />
            </TabsContent>

            <TabsContent value="atendimentos">
                <AtendimentoTab />
            </TabsContent>
        </Tabs>
    );
}
