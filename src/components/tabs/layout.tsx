// components/TabsPaciente.tsx

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
    const { pacienteSelecionado } = usePacienteContext();
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setDadosPaciente(pacienteSelecionado);
    }, [ pacienteSelecionado ]);

    const handleTabChange = (value: string) => {
        if (value === "mensalidades" && dadosPaciente) {
            router.push(`/private/mensalidades?idAluno=${dadosPaciente.id}`);
        } else if (value === "cadastro") {
            router.push('/private/pacientes');
        } else if (value === "atendimentos") {
            router.push('/private/atendimentos');
        }
    };

    return (
        <Tabs value={pathname.includes("mensalidades") ? "mensalidades" : pathname.includes("atendimentos") ? "atendimentos" : "cadastro"} onValueChange={handleTabChange}>
            {dadosPaciente && (
                <TabsList className="inline-flex">
                    <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
                    <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
                    <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
                </TabsList>
            )}

            <TabsContent value="cadastro">
                <CadastroTab dadosPaciente={dadosPaciente} />
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
