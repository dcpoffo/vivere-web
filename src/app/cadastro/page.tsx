"use client"
import { useEffect, useState } from 'react';
import { pacientes } from '../utils/pacientes';

// const pacientes = [
//     {
//         "ID": 1,
//         "NOME": "DARLAN RADAMES CONTE POFFO",
//         "CPF": "030.756.599-83",
//         "TELEFONE": "(47) 98855-7768",
//         "TELEFONE2": "(47) 3383-0226",
//         "DATANASCIMENTO": "1980-10-18T00:00:00.000Z",
//         "ENDERECO": "RUA VEREADOR JOSE MOSER, 419 - APTO 103\nBAIRRO: ESTAÇÃO\nCEP: 89138-000",
//         "EMAIL": "dcpoffo@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ANALISTA DE QUALIDADE"
//     },
//     {
//         "ID": 2,
//         "NOME": "MARIA CLARA SOUZA LIMA",
//         "CPF": "045.789.123-65",
//         "TELEFONE": "(11) 99987-1234",
//         "TELEFONE2": "(11) 3434-5678",
//         "DATANASCIMENTO": "1992-03-25T00:00:00.000Z",
//         "ENDERECO": "AVENIDA PAULISTA, 1500 - APTO 901\nBAIRRO: BELA VISTA\nCEP: 01310-100",
//         "EMAIL": "mariaclara@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "DESENVOLVEDORA DE SOFTWARE"
//     },
//     {
//         "ID": 3,
//         "NOME": "JOÃO PEDRO SANTOS SILVA",
//         "CPF": "089.456.123-00",
//         "TELEFONE": "(21) 99876-5432",
//         "TELEFONE2": "(21) 2233-4455",
//         "DATANASCIMENTO": "1985-06-17T00:00:00.000Z",
//         "ENDERECO": "RUA DA CONSOLAÇÃO, 200 - CASA 2\nBAIRRO: CENTRO\nCEP: 20230-001",
//         "EMAIL": "joaopedro@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ENGENHEIRO CIVIL"
//     },
//     {
//         "ID": 4,
//         "NOME": "CARLA MARIA FERREIRA",
//         "CPF": "012.345.678-90",
//         "TELEFONE": "(31) 91234-5678",
//         "TELEFONE2": "(31) 3234-5678",
//         "DATANASCIMENTO": "1979-11-12T00:00:00.000Z",
//         "ENDERECO": "RUA DOS PINHEIROS, 345\nBAIRRO: SAVASSI\nCEP: 30140-120",
//         "EMAIL": "carlaferreira@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "GERENTE FINANCEIRO"
//     },
//     {
//         "ID": 5,
//         "NOME": "ROBERTO ALVES COSTA",
//         "CPF": "987.654.321-00",
//         "TELEFONE": "(85) 99887-6543",
//         "TELEFONE2": "(85) 3366-7788",
//         "DATANASCIMENTO": "1990-05-09T00:00:00.000Z",
//         "ENDERECO": "RUA DAS FLORES, 890 - APTO 102\nBAIRRO: MEIRELES\nCEP: 60160-081",
//         "EMAIL": "robertocosta@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ADVOGADO"
//     },
//     {
//         "ID": 6,
//         "NOME": "ALICE MORAES PEREIRA",
//         "CPF": "223.456.789-10",
//         "TELEFONE": "(71) 98899-1111",
//         "TELEFONE2": "(71) 3233-4455",
//         "DATANASCIMENTO": "1988-12-02T00:00:00.000Z",
//         "ENDERECO": "AVENIDA SETE DE SETEMBRO, 1000\nBAIRRO: VITÓRIA\nCEP: 40060-001",
//         "EMAIL": "alicemoraes@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "MÉDICA"
//     },
//     {
//         "ID": 7,
//         "NOME": "PEDRO HENRIQUE ALMEIDA",
//         "CPF": "334.567.891-22",
//         "TELEFONE": "(19) 98765-4321",
//         "TELEFONE2": "(19) 3344-5566",
//         "DATANASCIMENTO": "1975-07-08T00:00:00.000Z",
//         "ENDERECO": "RUA DOS ANDRADAS, 456 - APTO 801\nBAIRRO: CENTRO\nCEP: 13010-902",
//         "EMAIL": "pedroalmeida@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "PROFESSOR"
//     },
//     {
//         "ID": 8,
//         "NOME": "LUCAS GONÇALVES MARTINS",
//         "CPF": "456.789.012-34",
//         "TELEFONE": "(61) 99888-7766",
//         "TELEFONE2": "(61) 3444-5566",
//         "DATANASCIMENTO": "1983-02-14T00:00:00.000Z",
//         "ENDERECO": "SHIS QI 26 CONJUNTO 12 CASA 5\nBAIRRO: LAGO SUL\nCEP: 71665-120",
//         "EMAIL": "lucasmartins@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ARQUITETO"
//     },
//     {
//         "ID": 9,
//         "NOME": "BEATRIZ ALVES CARVALHO",
//         "CPF": "567.890.123-45",
//         "TELEFONE": "(41) 99900-1122",
//         "TELEFONE2": "(41) 3333-2211",
//         "DATANASCIMENTO": "1995-09-21T00:00:00.000Z",
//         "ENDERECO": "RUA XV DE NOVEMBRO, 876 - APTO 203\nBAIRRO: CENTRO\nCEP: 80020-310",
//         "EMAIL": "beatrizcarvalho@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "PSICÓLOGA"
//     },
//     {
//         "ID": 10,
//         "NOME": "RAFAEL BARBOSA GOMES",
//         "CPF": "678.901.234-56",
//         "TELEFONE": "(51) 99977-8899",
//         "TELEFONE2": "(51) 3232-5656",
//         "DATANASCIMENTO": "1986-04-30T00:00:00.000Z",
//         "ENDERECO": "AVENIDA INDEPENDÊNCIA, 345 - APTO 102\nBAIRRO: INDEPENDÊNCIA\nCEP: 90035-070",
//         "EMAIL": "rafaelgomes@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "CONTADOR"
//     },
//     {
//         "ID": 11,
//         "NOME": "CAROLINA MELO FERREIRA",
//         "CPF": "789.012.345-67",
//         "TELEFONE": "(27) 98877-6655",
//         "TELEFONE2": "(27) 3222-3344",
//         "DATANASCIMENTO": "1991-08-15T00:00:00.000Z",
//         "ENDERECO": "RUA SETE DE SETEMBRO, 678\nBAIRRO: PRAIA DO CANTO\nCEP: 29055-500",
//         "EMAIL": "carolinaferreira@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "JORNALISTA"
//     },
//     {
//         "ID": 12,
//         "NOME": "FERNANDO MACHADO SILVA",
//         "CPF": "890.123.456-78",
//         "TELEFONE": "(62) 99885-4433",
//         "TELEFONE2": "(62) 3266-7788",
//         "DATANASCIMENTO": "1978-01-22T00:00:00.000Z",
//         "ENDERECO": "AVENIDA GOIÁS, 1234 - APTO 304\nBAIRRO: SETOR CENTRAL\nCEP: 74010-010",
//         "EMAIL": "fernandosilva@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ANALISTA DE SISTEMAS"
//     },
//     {
//         "ID": 13,
//         "NOME": "MARINA COSTA REIS",
//         "CPF": "901.234.567-89",
//         "TELEFONE": "(73) 99999-1234",
//         "TELEFONE2": "(73) 3244-5678",
//         "DATANASCIMENTO": "1982-03-03T00:00:00.000Z",
//         "ENDERECO": "RUA DA BANDEIRA, 987\nBAIRRO: CENTRO\nCEP: 45600-000",
//         "EMAIL": "marinareis@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "CONSULTORA DE NEGÓCIOS"
//     },
//     {
//         "ID": 14,
//         "NOME": "HENRIQUE PEREIRA OLIVEIRA",
//         "CPF": "012.345.678-91",
//         "TELEFONE": "(13) 98877-8899",
//         "TELEFONE2": "(13) 3256-6677",
//         "DATANASCIMENTO": "1970-07-07T00:00:00.000Z",
//         "ENDERECO": "AVENIDA ANA COSTA, 1000 - SALA 101\nBAIRRO: GONZAGA\nCEP: 11060-003",
//         "EMAIL": "henriqueoliveira@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "ADMINISTRADOR"
//     },
//     {
//         "ID": 15,
//         "NOME": "LAURA DIAS MORAIS",
//         "CPF": "123.456.789-00",
//         "TELEFONE": "(15) 99777-8899",
//         "TELEFONE2": "(15) 3212-3344",
//         "DATANASCIMENTO": "1994-05-05T00:00:00.000Z",
//         "ENDERECO": "RUA SÃO BENTO, 555 - APTO 305\nBAIRRO: CENTRO\nCEP: 18035-000",
//         "EMAIL": "lauramoraes@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "NUTRICIONISTA"
//     },
//     {
//         "ID": 16,
//         "NOME": "GUILHERME ROCHA ARAÚJO",
//         "CPF": "234.567.890-12",
//         "TELEFONE": "(67) 99876-5544",
//         "TELEFONE2": "(67) 3383-2233",
//         "DATANASCIMENTO": "1987-10-10T00:00:00.000Z",
//         "ENDERECO": "RUA DOS JACARANDÁS, 321 - CASA 1\nBAIRRO: JARDIM VERDE\nCEP: 79002-000",
//         "EMAIL": "guilhermearaujo@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ENGENHEIRO DE PRODUÇÃO"
//     },
//     {
//         "ID": 17,
//         "NOME": "BRUNA SILVA LIMA",
//         "CPF": "345.678.901-23",
//         "TELEFONE": "(81) 99765-4433",
//         "TELEFONE2": "(81) 3244-7788",
//         "DATANASCIMENTO": "1993-12-21T00:00:00.000Z",
//         "ENDERECO": "AVENIDA BOA VIAGEM, 2000 - APTO 1002\nBAIRRO: BOA VIAGEM\nCEP: 51020-000",
//         "EMAIL": "brunalima@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "FISIOTERAPEUTA"
//     },
//     {
//         "ID": 18,
//         "NOME": "FELIPE OLIVEIRA SANTOS",
//         "CPF": "456.789.012-34",
//         "TELEFONE": "(27) 99988-7766",
//         "TELEFONE2": "(27) 3333-1122",
//         "DATANASCIMENTO": "1991-04-01T00:00:00.000Z",
//         "ENDERECO": "RUA DO CANAL, 789 - CASA 3\nBAIRRO: JUCUTUQUARA\nCEP: 29043-000",
//         "EMAIL": "felipesantos@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "ENGENHEIRO MECÂNICO"
//     },
//     {
//         "ID": 19,
//         "NOME": "AMANDA RODRIGUES FREITAS",
//         "CPF": "567.890.123-45",
//         "TELEFONE": "(91) 99887-7766",
//         "TELEFONE2": "(91) 3222-3344",
//         "DATANASCIMENTO": "1989-06-15T00:00:00.000Z",
//         "ENDERECO": "TRAVESSA DA SERPENTE, 345 - APTO 405\nBAIRRO: NAZARÉ\nCEP: 66035-070",
//         "EMAIL": "amandafreitas@gmail.com",
//         "SITUACAO": "ATIVO",
//         "PROFISSAO": "BIOMÉDICA"
//     },
//     {
//         "ID": 20,
//         "NOME": "DIEGO VIEIRA SILVA",
//         "CPF": "678.901.234-56",
//         "TELEFONE": "(79) 98888-5544",
//         "TELEFONE2": "(79) 3212-2211",
//         "DATANASCIMENTO": "1992-07-04T00:00:00.000Z",
//         "ENDERECO": "RUA DA LAGOA, 234 - CASA 2\nBAIRRO: TREZE DE JULHO\nCEP: 49020-000",
//         "EMAIL": "diegosilva@gmail.com",
//         "SITUACAO": "INATIVO",
//         "PROFISSAO": "FARMACÊUTICO"
//     }
// ];

export default function Pacientes() {

    //const api = useAPI();
    //const [ loading, setLoading ] = useState(true);
    //const [ pacientes, setPacientes ] = useState<any[]>([]);

    // useEffect(() => {
    //     loadPacientes();
    // }, [ pacientes ]);

    // const loadPacientes = async () => {
    //     try {
    //         const result = await api.get("/alunos");
    //         setPacientes(result.data);
    //     } catch (e) {
    //         alert("Erro ao carregar dados. Tente novamente mais tarde.")            
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // if (loading) {        
    //     return (
    //         <div>
    //             Carregando informações...
    //         </div>
    //     )
    // }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Cadastro Principal</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nome</th>
                        <th className="py-2 px-4 border-b">CPF</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Telefone</th>
                        <th className="py-2 px-4 border-b">Telefone 2</th>
                        <th className="py-2 px-4 border-b">Situação</th>
                        {/* <th className="py-2 px-4 border-b">Data de Nascimento</th>
                        <th className="py-2 px-4 border-b">Endereço</th> */}
                        {/* <th className="py-2 px-4 border-b">Profissão</th> */}
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.ID}>
                            <td className="py-2 px-4 border-b">{paciente.NOME}</td>
                            <td className="py-2 px-4 border-b">{paciente.CPF}</td>
                            <td className="py-2 px-4 border-b">{paciente.EMAIL || '-'}</td>
                            <td className="py-2 px-4 border-b">{paciente.TELEFONE}</td>
                            <td className="py-2 px-4 border-b">{paciente.TELEFONE2 || '-'}</td>
                            {/* <td className="py-2 px-4 border-b">{new Date(paciente.DATANASCIMENTO).toLocaleDateString()}</td> */}
                            {/* <td className="py-2 px-4 border-b">{paciente.ENDERECO || '-'}</td> */}
                            <td className="py-2 px-4 border-b">{paciente.SITUACAO}</td>
                            {/* <td className="py-2 px-4 border-b">{paciente.PROFISSAO}</td> */}
                            <td className="py-2 px-4 border-b text-center">
                                <button className="text-blue-500 hover:text-blue-700 ">
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
