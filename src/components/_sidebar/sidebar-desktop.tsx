'use client';


import { SidebarItems } from '@/types';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, MoreHorizontal, Settings, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { usePathname } from 'next/navigation';
import { pacientes_id_nome } from '@/app/utils/pacientes_id_nome';
import { SidebarButton } from './sidebar-button';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const pathname = usePathname();
  const [ isSearchOpen, setIsSearchOpen ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('Vivere-web'); // Estado para o termo de busca
  const [ students, setStudents ] = useState([]);
  const [ filteredStudents, setFilteredStudents ] = useState([]);

  useEffect(() => {
    if (isSearchOpen) {
      fetch('http://127.0.0.1:3333/alunos') // Exemplo de endpoint
        .then((response) => response.json())
        .then((data) => {
          setStudents(data); // Armazena os dados da API
          setFilteredStudents(data); // Inicializa o filtro com todos os alunos
        })
        .catch((error) => console.error('Erro ao buscar alunos:', error));
    }
  }, [ isSearchOpen ]);

  // Filtra os alunos conforme o termo de busca
  useEffect(() => {
    setFilteredStudents(
      students.filter((student: any) =>
        student.NOME.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [ searchTerm, students ]);


  return (
    <aside className='w-[270px] max-w-xs h-screen fixed left-0 top-0 z-40 border-r'>
      <div className='h-full px-3 py-4'>
        {/* Título com ícone de lupa */}
        <div className='flex justify-between items-center'>
          <h3 className='mx-3 text-lg font-semibold text-foreground'>{searchTerm}</h3> {/* Atualiza o texto */}
          {/* Ícone de Lupa */}
          <button onClick={() => setIsSearchOpen(true)} aria-label="Search">
            <Search className="w-6 h-6" />
          </button>
        </div>

        <div className='mt-5'>
          <div className='flex flex-col gap-1 w-full'>
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className='w-full'
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {props.sidebarItems.extras}
          </div>

          <div className='absolute left-0 bottom-3 w-full px-3'>
            <Separator className='absolute -top-3 left-0 w-full' />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='ghost' className='w-full justify-start'>
                  <div className='flex justify-between items-center w-full'>
                    <div className='flex gap-2'>
                      <Avatar className='h-5 w-5'>
                        <AvatarImage src='https://github.com/max-programming.png' />
                        <AvatarFallback>Max Programming</AvatarFallback>
                      </Avatar>
                      <span>Max Programming</span>
                    </div>
                    <MoreHorizontal size={20} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='mb-2 w-56 p-3 rounded-[1rem]'>
                <div className='space-y-1'>
                  <Link href='/'>
                    <SidebarButton size='sm' icon={Settings} className='w-full'>
                      Account Settings
                    </SidebarButton>
                  </Link>
                  <SidebarButton size='sm' icon={LogOut} className='w-full'>
                    Log Out
                  </SidebarButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Modal de Pesquisa */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pesquisar paciente</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            className="w-full border rounded-md p-2"
            placeholder="Digite o nome do paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o valor digitado
          />
          
          {/* Tabela de resultados */}
          <table className="bg-blue-500 w-full mt-4">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((paciente: any) => (
                <tr key={paciente.ID} >
                  <td>{paciente.ID}</td>
                  <td>{paciente.NOME}</td>                  
                </tr>
              ))}
            </tbody>
          </table>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="default">
                OK
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
