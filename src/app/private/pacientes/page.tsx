"use client";

import { useState, useEffect } from 'react';
import BuscaPaciente from '@/components/buscaPaciente/buscaPaciente';
import { usePacienteContext } from '@/context/PacienteContext';
import { Paciente } from '@/types/Paciente';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/signOutButton';
import { useSession } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CadastroTab from '@/components/tabs/cadastro';
import MensalidadeTab from '@/components/tabs/mensalidade';
import AtendimentoTab from '@/components/tabs/atendimento';
import { useRouter } from 'next/navigation';

export default function Pacientes() {
    const { pacienteSelecionado, selecionarPaciente } = usePacienteContext();
    const [ editando, setEditando ] = useState(false);
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const [ dadosOriginais, setDadosOriginais ] = useState<Paciente | null>(pacienteSelecionado);
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        setDadosPaciente(pacienteSelecionado);
        setDadosOriginais(pacienteSelecionado);
    }, [ pacienteSelecionado ]);

    const handlePacienteSelecionado = (paciente: Paciente) => {
        selecionarPaciente(paciente);
        setDadosPaciente(paciente);
        setDadosOriginais(paciente);
    };

    const handleSalvar = async (e: any) => {
        e.preventDefault();
        if (dadosPaciente) {
            try {
                selecionarPaciente(dadosPaciente);
                setEditando(false);
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        } else {
            console.error("Dados do paciente não estão disponíveis.");
        }
    };

    const handleChange = (e: any) => {
        if (dadosPaciente) {
            const { name, value } = e.target;
            setDadosPaciente(prev => ({ ...prev!, [ name ]: value }));
        }
    };

    const handleAlterar = () => {
        if (dadosPaciente) {
            setEditando(true);
        }
    };

    const handleCancelar = () => {
        setDadosPaciente(dadosOriginais);
        setEditando(false);
    };

    const handleTabChange = (value: string) => {
        if (value === "mensalidades" && dadosPaciente) {
            // Navega para a rota de mensalidade do paciente selecionado
            router.push(`/private/mensalidades?idAluno=${dadosPaciente.id}`);
        } else if (value === "cadastro") {
            // Se voltar para a aba Cadastro, pode permanecer na mesma rota ou ir para a página correspondente
            router.push('/private/pacientes');
        } else if (value === "atendimentos") {
            router.push('/private/atendimentos')
        }
    };

    return (
        <div className='flex justify-start w-full'>
            <Tabs defaultValue="cadastro" onValueChange={handleTabChange}>
                {dadosPaciente && ( // Renderiza o TabsList apenas se um paciente estiver selecionado
                    <div className='flex justify-start w-full'>
                        <TabsList className='inline-flex'>
                            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
                            <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
                            <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
                            {/* Outras TabsTriggers podem ser adicionadas aqui se necessário */}
                        </TabsList>
                    </div>
                )}

                {dadosPaciente ? (
                    <>
                        {/* bg-slate-300 */}
                        <TabsContent value="cadastro">
                            <CadastroTab
                                dadosPaciente={dadosPaciente}
                                editando={editando}
                                handleSalvar={handleSalvar}
                                handleChange={handleChange}
                                handleAlterar={handleAlterar}
                                handleCancelar={handleCancelar}
                            />
                            {!editando && (
                                <div className="flex justify-center items-center mt-4 space-x-4"> {/* Flex para centralizar e espaçar os botões */}
                                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                                    {session && <SignOutButton />}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value='mensalidades'>
                            <MensalidadeTab />
                        </TabsContent>

                        <TabsContent value='atendimentos'>
                            <AtendimentoTab />
                        </TabsContent>

                    </>
                ) : (
                    <div className="pt-10 bg-slate-300 text-slate-900 w-full h-screen flex flex-col justify-center items-center">
                        <p>Nenhum paciente selecionado</p>
                        <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                    </div>
                )}
            </Tabs>
        </div>
    );
}

