import React, { useState, useEffect } from 'react';
import { Dialog, DialogOverlay, DialogContent, DialogTitle } from '../ui/dialog';
import { useAPI } from '@/service/API';
import { Paciente } from '@/types/Paciente';

interface BuscaPacienteProps {
    onPacienteSelecionado: (paciente: Paciente) => void;
}

const BuscaPaciente: React.FC<BuscaPacienteProps> = ({ onPacienteSelecionado }) => {
    const [ open, setOpen ] = useState(false);
    const [ pacientes, setPacientes ] = useState<Paciente[]>([]); // Definindo explicitamente o tipo como Paciente[]
    const [ search, setSearch ] = useState('');
    const [ filteredPacientes, setFilteredPacientes ] = useState<Paciente[]>([]); // Definindo explicitamente o tipo como Paciente[]

    const api = useAPI();

    useEffect(() => {
        if (Array.isArray(pacientes)) {
            if (search) {
                setFilteredPacientes(
                    pacientes.filter((paciente: Paciente) =>
                        paciente.nome.toLowerCase().includes(search.toLowerCase())
                    )
                );
            } else {
                setFilteredPacientes(pacientes);
            }
        }
    }, [ search, pacientes ]);

    const fetchPacientes = async () => {
        try {
            //const result = await api.get("/produtos");
            const response = await api.get('/pacientes');
            const data: Paciente[] = response.data; // Especificando que o data é um array de Pacientes
            setPacientes(data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchPacientes();
    };

    const handleSelectPaciente = (paciente: Paciente) => {
        onPacienteSelecionado(paciente);
        setOpen(false); // Fecha o diálogo após a seleção
    };

    return (
        <div>
            <button className='mt-4 rounded-lg bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 mb-4' onClick={handleOpen}>
                Selecionar paciente
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogOverlay />
                <DialogContent className='max-w-lg'>
                    <DialogTitle>Selecionar Paciente</DialogTitle>
                    <input
                        type="text"
                        placeholder="Pesquisar paciente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='mt-2 p-2 border rounded w-full'
                    />
                    <ul className='mt-4 max-h-60 overflow-y-auto'>
                        {filteredPacientes.map((paciente: Paciente) => (
                            <li
                                key={paciente.id}
                                className='p-2 border-b text-slate-900 cursor-pointer'
                                onClick={() => handleSelectPaciente(paciente)}
                            >
                                {paciente.nome}
                            </li>
                        ))}
                    </ul>
                    <button className='mt-4 bg-blue-500 text-white px-4 py-2 rounded' onClick={() => setOpen(false)}>
                        Fechar
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BuscaPaciente;
