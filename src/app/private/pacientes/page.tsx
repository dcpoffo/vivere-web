"use client";

import { useState, useEffect } from 'react';
import BuscaPaciente from '@/components/buscaPaciente/buscaPaciente';
import { usePacienteContext } from '@/context/PacienteContext';
import { Paciente } from '@/types/Paciente';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/signOutButton';
import { useSession } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

export default function Pacientes() {
    const { pacienteSelecionado, selecionarPaciente } = usePacienteContext();
    const [ editando, setEditando ] = useState(false);
    const [ dadosPaciente, setDadosPaciente ] = useState<Paciente | null>(pacienteSelecionado);
    const [ dadosOriginais, setDadosOriginais ] = useState<Paciente | null>(pacienteSelecionado);
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        console.log("entrou na pagina de pacientes")
    }, []);

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

    return (

        <div className="bg-slate-300 text-slate-900 w-full h-screen flex justify-center items-start">
            {dadosPaciente ? (
                <div className="flex flex-col items-center bg-slate-300 w-full">
                    <h1 className="text-2xl font-bold mb-4">Informações do paciente</h1>
                    <form onSubmit={handleSalvar} className="flex flex-col gap-4 w-1/2">
                        {/* Campos do formulário */}
                        <div className="grid grid-cols-5 gap-2 items-center">
                            <label className="col-span-1 font-semibold">
                                Código
                                <input
                                    type="text"
                                    name="id"
                                    value={dadosPaciente.id || ''}
                                    disabled
                                    className="w-full border p-2"
                                />
                            </label>
                            <label className="col-span-4 font-semibold">
                                Nome
                                <input
                                    type="text"
                                    name="nome"
                                    value={dadosPaciente.nome || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="font-semibold">
                                Situação
                                <input
                                    type="text"
                                    name="situacao"
                                    value={dadosPaciente.situacao || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                            <label className="font-semibold">
                                C.P.F.
                                <input
                                    type="text"
                                    name="cpf"
                                    value={dadosPaciente.cpf || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="font-semibold">
                                Contato 1
                                <input
                                    type="text"
                                    name="contato1"
                                    value={dadosPaciente.contato1 || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                            <label className="font-semibold">
                                Contato 2
                                <input
                                    type="text"
                                    name="contato2"
                                    value={dadosPaciente.contato2 || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="flex flex-col font-semibold">
                                Data Nascimento
                                <input
                                    type="date"
                                    name="dataNascimento"
                                    value={dadosPaciente.dataNascimento ? dadosPaciente.dataNascimento.split('T')[ 0 ] : ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-40 border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="font-semibold">
                                Endereço
                                <input
                                    type="text"
                                    name="endereco"
                                    value={dadosPaciente.endereco || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="font-semibold">
                                E-mail
                                <input
                                    type="email"
                                    name="email"
                                    value={dadosPaciente.email || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="font-semibold">
                                Profissão
                                <input
                                    type="text"
                                    name="profissao"
                                    value={dadosPaciente.profissao || ''}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    className="w-full border p-2"
                                />
                            </label>
                        </div>

                        <div className="flex gap-4 mt-4 mb-4 justify-end">
                            {editando ? (
                                <>
                                    <Button type="submit" className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md">
                                        Salvar
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleCancelar}
                                        className="px-4 py-2 h-10 text-white"
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAlterar}
                                    className="px-4 py-2 h-10 bg-green-700 text-white rounded-md"
                                >
                                    Alterar cadastro
                                </button>
                            )}
                        </div>
                    </form>
                    {!editando && (
                        <div className="flex justify-center items-center mt-4 space-x-4"> {/* Flex para centralizar e espaçar os botões */}
                            <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                            {session && <SignOutButton />}
                        </div>
                    )}
                </div>
            ) : (
                <div className="pt-10 bg-slate-300 text-slate-900 w-full h-screen flex flex-col justify-center items-center">
                    <p>Nenhum paciente selecionado</p>
                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                    <SignOutButton />
                </div>
            )}
        </div>


    );
}


// const handleTabChange = (value: string) => {
//     if (value === "mensalidades" && dadosPaciente) {
//         // Navega para a rota de mensalidade do paciente selecionado
//         router.push(`/private/mensalidades?idAluno=${dadosPaciente.id}`);
//     } else if (value === "cadastro") {
//         // Se voltar para a aba Cadastro, pode permanecer na mesma rota ou ir para a página correspondente
//         router.push('/private/pacientes');
//     } else if (value === "atendimentos") {
//         router.push('/private/atendimentos')
//     }
// };

// <div className='flex justify-center items-center w-full '>
//     <Tabs defaultValue="cadastro" onValueChange={handleTabChange}>
//         {dadosPaciente && ( // Renderiza o TabsList apenas se um paciente estiver selecionado
//             <div className='flex justify-start w-full'>
//                 <TabsList className='inline-flex'>
//                     <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
//                     <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
//                     <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
//                     {/* Outras TabsTriggers podem ser adicionadas aqui se necessário */}
//                 </TabsList>
//             </div>
//         )}

//         {dadosPaciente ? (
//             <>
//                 {/* bg-slate-300 */}
//                 <TabsContent value="cadastro">
//                     <CadastroTab
//                         dadosPaciente={dadosPaciente}
//                         editando={editando}
//                         handleSalvar={handleSalvar}
//                         handleChange={handleChange}
//                         handleAlterar={handleAlterar}
//                         handleCancelar={handleCancelar}
//                     />
//                     {!editando && (
//                         <div className="flex justify-center items-center mt-4 space-x-4"> {/* Flex para centralizar e espaçar os botões */}
//                             <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
//                             {session && <SignOutButton />}
//                         </div>
//                     )}
//                 </TabsContent>

//                 <TabsContent value='mensalidades'>
//                     <MensalidadeTab />
//                 </TabsContent>

//                 <TabsContent value='atendimentos'>
//                     <AtendimentoTab />
//                 </TabsContent>

//             </>
//         ) : (
//             <div className="pt-10 bg-slate-300 text-slate-900 w-full h-screen flex flex-col justify-center items-center">
//                 <p>Nenhum paciente selecionado</p>
//                 <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
//             </div>
//         )}
//     </Tabs>
// </div>
