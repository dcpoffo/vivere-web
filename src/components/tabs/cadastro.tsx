import React from 'react';
import { Button } from '../ui/button';

interface CadastroTabProps {
    dadosPaciente: any; // substitua `any` pelo tipo correto
    editando: boolean;
    handleSalvar: (event: React.FormEvent) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleAlterar: () => void;
    handleCancelar: () => void;
}

const CadastroTab: React.FC<CadastroTabProps> = ({
    dadosPaciente,
    editando,
    handleSalvar,
    handleChange,
    handleAlterar,
    handleCancelar
}) => (
    <div className="bg-slate-300 text-slate-900 w-full h-screen flex justify-center items-start">
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
                            className="w-full border p-2" />
                    </label>
                    <label className="col-span-4 font-semibold">
                        Nome
                        <input
                            type="text"
                            name="nome"
                            value={dadosPaciente.nome || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <label className='font-semibold'>
                        Situação
                        <input
                            type="text"
                            name="situacao"
                            value={dadosPaciente.situacao || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                    <label className='font-semibold'>
                        C.P.F.
                        <input
                            type="text"
                            name="cpf"
                            value={dadosPaciente.cpf || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <label className='font-semibold'>
                        Contato 1
                        <input
                            type="text"
                            name="contato1"
                            value={dadosPaciente.contato1 || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                    <label className='font-semibold'>
                        Contato 2
                        <input
                            type="text"
                            name="contato2"
                            value={dadosPaciente.contato2 || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className='flex flex-col font-semibold'>
                        Data Nascimento
                        <input
                            type="date"
                            name="dataNascimento"
                            value={dadosPaciente.dataNascimento ? dadosPaciente.dataNascimento.split('T')[ 0 ] : ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-40 border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className='font-semibold'>
                        Endereço
                        <input
                            type="text"
                            name="endereco"
                            value={dadosPaciente.endereco || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className='font-semibold'>
                        E-mail
                        <input
                            type="email"
                            name="email"
                            value={dadosPaciente.email || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className='font-semibold'>
                        Profissão
                        <input
                            type="text"
                            name="profissao"
                            value={dadosPaciente.profissao || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full border p-2" />
                    </label>
                </div>

                <div className="flex gap-4 mt-4 mb-4 justify-end">
                    {editando ? (
                        <>
                            <Button type="submit" className="px-4 py-2 h-10 bg-blue-600 text-white rounded-md">Salvar</Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleCancelar}
                                className="px-4 py-2 h-10 text-white">
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAlterar}
                            className="px-4 py-2 h-10 bg-green-700 text-white rounded-md">
                            Alterar cadastro
                        </button>
                    )}
                </div>
            </form>
        </div>
    </div>
);

export default CadastroTab;
