"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface Paciente {
    id: string;
    nome: string;
    cpf: string;
    contato1?: string;
    contato2?: string;
    dataNascimento?: string;
    endereco?: string;
    email?: string;
    situacao: string;
    profissao?: string;
    // Outras propriedades do paciente, se houver
}

interface PacienteContextType {
    pacienteSelecionado: Paciente | null;
    selecionarPaciente: (paciente: Paciente) => void;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export const PacienteProvider = ({ children }: { children: ReactNode }) => {
    const [ pacienteSelecionado, setPacienteSelecionado ] = useState<Paciente | null>(null);

    const selecionarPaciente = (paciente: Paciente) => setPacienteSelecionado(paciente);

    return (
        <PacienteContext.Provider value={{ pacienteSelecionado, selecionarPaciente }}>
            {children}
        </PacienteContext.Provider>
    );
};

export const usePacienteContext = () => {
    const context = useContext(PacienteContext);
    if (!context) {
        throw new Error('usePaciente deve ser usado dentro de um PacienteProvider');
    }
    return context;
};
