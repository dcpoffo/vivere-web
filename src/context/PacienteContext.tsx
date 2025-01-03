"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Paciente {
    id: string;
    nome: string;
    cpf: string;
    contato1?: string;
    contato2?: string;
    dataNascimento?: Date;
    endereco?: string;
    email?: string;
    situacao: string;
    profissao?: string;
}

interface PacienteContextType {
    pacienteSelecionado: Paciente | null;
    selecionarPaciente: (paciente: Paciente) => void;
    pacientes: Paciente[];
    addPaciente: (paciente: Paciente) => void;
    fetchPacientes: () => void;
    limparPacienteSelecionado: () => void;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export const PacienteProvider = ({ children }: { children: ReactNode }) => {
    const [ pacienteSelecionado, setPacienteSelecionado ] = useState<Paciente | null>(null);
    const [ pacientes, setPacientes ] = useState<Paciente[]>([]);

    const limparPacienteSelecionado = () => setPacienteSelecionado(null);

    const selecionarPaciente = (paciente: Paciente) => setPacienteSelecionado(paciente);

    const addPaciente = (paciente: Paciente) => {
        setPacientes((prevPacientes) => [ ...prevPacientes, paciente ]);
    };

    const fetchPacientes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pacientes`);
            setPacientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    return (
        <PacienteContext.Provider value={{ pacienteSelecionado, selecionarPaciente, pacientes, addPaciente, fetchPacientes, limparPacienteSelecionado }}>
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
