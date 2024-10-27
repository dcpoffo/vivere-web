"use client";
import BuscaPaciente from '@/components/buscaPaciente/buscaPaciente';
import { useState } from 'react';

export default function Pacientes() {
    const [ pacienteSelecionado, setPacienteSelecionado ] = useState(null);

    const handlePacienteSelecionado = (paciente: any) => {
        setPacienteSelecionado(paciente);
    };

    return (
        <div className='bg-slate-300 text-slate-900 w-full h-screen flex justify-center items-center'>
            <div className='flex flex-col items-center bg-slate-300 w-full mt-14'>
                <h1 className='text-2xl font-bold mb-4'>Informações do paciente</h1>
                {pacienteSelecionado ? (
                    <p className='text-2xl font-semibold'>{pacienteSelecionado.nome}</p>
                ) : (
                    <p className='text-lg'>Nenhum paciente selecionado</p>
                )}

                <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
            </div>
        </div>
    );
}
