// src/types/Paciente.ts
export type Paciente = {
    id: string;
    nome: string;
    situacao: string;
    cpf: string;
    contato1?: string;
    contato2?: string;
    dataNascimento?: string;
    endereco?: string;
    email?: string;
    profissao?: string;
};
