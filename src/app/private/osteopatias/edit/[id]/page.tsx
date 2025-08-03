"use client"

import DeniedPage from "@/app/denied/page";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAPI } from "@/service/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckboxPadrao } from "@/components/checkBox/CheckBoxPadrao";
import { da } from "date-fns/locale";

const formSchema = z.object({
    dataAvaliacao: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato dd-MM-aaaa" })
        .optional(),

    queixaPrincipal: z.string().max(200, "O campo deve ter no máximo 200 caracteres").optional(),
    historicoQueixa: z.string().max(1000, "O campo deve ter no máximo 1000 caracteres").optional(),
    outrasQueixas: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    caracteristicaDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),
    horarioDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),
    oquePioraDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),
    oqueMelhoraDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),
    frequenciaDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),
    tratamentoDor: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),

    eva: z.preprocess((val) => {
        if (val === '') return undefined; // Faz com que campo vazio seja tratado como "não preenchido"
        if (typeof val === 'string') {
            const parsed = Number(val);
            return isNaN(parsed) ? val : parsed;
        }
        return val;
    }, z.number({
        required_error: "O campo EVA é obrigatório",
        invalid_type_error: "Informe um número válido entre 0 e 10",
    })
        .int("Informe um número inteiro")
        .min(0, "O valor deve ser no mínimo 0")
        .max(10, "O valor deve ser no máximo 10")
    ),

    cirurgia: z.string().max(1000, "O campo deve ter no máximo 1000 caracteres").optional(),

    halitose: z.boolean().default(false),
    dorDeGarganta: z.boolean().default(false),
    disfagia: z.boolean().default(false),
    azia: z.boolean().default(false),
    tosseSeca: z.boolean().default(false),
    esofagite: z.boolean().default(false),
    perdaPeso: z.boolean().default(false),
    obsEsofago: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),
    diabete: z.boolean().default(false),
    gordura: z.boolean().default(false),
    infeccoes: z.boolean().default(false),
    obsPancreas: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    hipertensao: z.boolean().default(false),
    calculos: z.boolean().default(false),
    edema: z.boolean().default(false),
    urinaSangue: z.boolean().default(false),
    poucaUrina: z.boolean().default(false),
    muitaUrina: z.boolean().default(false),
    perdaUrina: z.boolean().default(false),
    dorUrinar: z.boolean().default(false),
    queimacaoUrinar: z.boolean().default(false),
    alteracaoCloracao: z.boolean().default(false),
    infeccaoRim: z.boolean().default(false),
    obsRim: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),

    dorEstomago: z.boolean().default(false),
    eructacao: z.boolean().default(false),
    refluxo: z.boolean().default(false),
    hernia: z.boolean().default(false),
    alimentosAcidos: z.boolean().default(false),
    estufamento: z.boolean().default(false),
    nauseas: z.boolean().default(false),
    gastrite: z.boolean().default(false),
    obsEstomago: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),

    perdaPesoFigado: z.boolean().default(false),
    bocaAmarga: z.boolean().default(false),
    desconfortoAbnominal: z.boolean().default(false),
    congestaoIntestinal: z.boolean().default(false),
    alimentosGordurosos: z.boolean().default(false),
    ressaca: z.boolean().default(false),
    hepatite: z.boolean().default(false),
    obsFigado: z.string().max(100, "O campo deve ter no máximo 100 caracteres").optional(),

    medicacao: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    alimentacao: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    emocional: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    sono: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    atividadeFisica: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    trabalho: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    testesOrtopedicos: z.string().max(1000, "O campo deve ter no máximo 1000 caracteres").optional(),
    testesOsteopaticos: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    diagnosticoPorImagem: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    diagnosticoTecidual: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    diagnosticoOsteopatico: z.string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),

    constipacao: z.boolean().default(false),
    hemorroidas: z.boolean().default(false),
    diarreia: z.boolean().default(false),
    sensacaoEvacuacao: z.boolean().default(false),
    flatulencia: z.boolean().default(false),
    qualidadeFezes: z.boolean().default(false),
    obsIntestino: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    estufamentoAbdominal: z.boolean().default(false),
    intolerancia: z.boolean().default(false),
    colicas: z.boolean().default(false),
    calculosBiliares: z.boolean().default(false),
    obsVesiculaBiliar: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    dificuldadeMiccao: z.boolean().default(false),
    diminuicaoMiccao: z.boolean().default(false),
    obsProstata: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    dorPreMenstrual: z.boolean().default(false),
    dorDuranteMenstruacao: z.boolean().default(false),
    dorPosMenstrual: z.boolean().default(false),
    menstruacaoIrregular: z.boolean().default(false),
    dorRelacaoSexual: z.boolean().default(false),
    dismenorreia: z.boolean().default(false),
    amenorreia: z.boolean().default(false),
    obsUtero: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    arritmia: z.boolean().default(false),
    angina: z.boolean().default(false),
    insuficienciaCardiaca: z.boolean().default(false),
    hipertensaoSistemaCardiorespiratorio: z.boolean().default(false),
    sindromeVasoVagal: z.boolean().default(false),
    desmaios: z.boolean().default(false),
    cansaco: z.boolean().default(false),
    dispneia: z.boolean().default(false),
    sinusite: z.boolean().default(false),
    rinite: z.boolean().default(false),
    bronquite: z.boolean().default(false),
    asma: z.boolean().default(false),
    pneumonia: z.boolean().default(false),
    fumante: z.boolean().default(false),
    maCirculacao: z.boolean().default(false),
    varizes: z.boolean().default(false),
    edemaMMSS: z.boolean().default(false),
    edemaMMII: z.boolean().default(false),
    obsSistemaCardiorespiratorio: z.string().max(300, "O campo deve ter no máximo 300 caracteres").optional(),

    peDireito: z.string().max(20, "O campo deve ter no máximo 20 caracteres").optional(),
    peDireitoVaro: z.boolean().default(false),
    peDireitoValgo: z.boolean().default(false),
    peDireitoPlano: z.boolean().default(false),
    peDireitoCavo: z.boolean().default(false),

    peEsquerdo: z.string().max(20, "O campo deve ter no máximo 20 caracteres").optional(),
    peEsquerdoVaro: z.boolean().default(false),
    peEsquerdoValgo: z.boolean().default(false),
    peEsquerdoPlano: z.boolean().default(false),
    peEsquerdoCavo: z.boolean().default(false),
    testeInibicaoPodal: z.boolean().default(false),
    txtTesteInibicaoPodal: z.string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),

    // classe1: z
    //     boolean().default(false),
    // classe2: z
    //     boolean().default(false),
    // aberta: z
    //     boolean().default(false),
    // profunda: z
    //     boolean().default(false),
    // classe3: z
    //     boolean().default(false),
    // mordidaCruzadaD: z
    //     boolean().default(false),
    // mordidaCruzadaE: z
    //     boolean().default(false),
    // mordidaCruzadaB: z
    //     boolean().default(false),
    // ausenciaDeDentes: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
    // testeInibicaoATM: z
    //     boolean().default(false),
    // txtTesteInibicaoATM: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
    // estrabismoConvergenteD: z
    //     boolean().default(false),
    // estrabismoConvergenteE: z
    //     boolean().default(false),
    // estrabismoDivergenteD: z
    //     boolean().default(false),
    // estrabismoDivergenteE: z
    //     boolean().default(false),
    // hipoconvergenciaD: z
    //     boolean().default(false),
    // hipoconvergenciaE: z
    //     boolean().default(false),
    // hipoconvergenciaBilateral: z
    //     boolean().default(false),
    // testeInibicaoOlhos: z
    //     boolean().default(false),
    // txtTesteInibicaoOlhos: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
    // cicatriz: z
    //     boolean().default(false),
    // localCicatriz: z
    //     .string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    // testeInibicaoCicatriz: z
    //     boolean().default(false),
    // txtTesteInibicaoCicatriz: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
    // lift: z
    //     boolean().default(false),
    // txtLift: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
    // localViscera: z
    //     .string().max(500, "O campo deve ter no máximo 500 caracteres").optional(),
    // testeInibicaoLift: z
    //     boolean().default(false),
    // txtTesteInibicaoLift: z
    //     .string().max(50, "O campo deve ter no máximo 50 caracteres").optional(),
})

type Osteopatia = {
    alimentacao: string,
    alimentosAcidos: string,
    alimentosGordurosos: string,
    amenorreia: string,
    angina: string,
    aperta: string,
    arritmia: string,
    asma: string,
    ausenciaDeDentes: string,
    azia: string,
    bocaAmarga: string,
    bronquite: string,
    calculoss: string,
    calculosBiliares: string,
    cansaco: string,
    caracteristicaDor: string,
    cicatriz: string,
    classe1: string,
    classe2: string,
    classe3: string,
    colicas: string,
    congestaoIntestinal: string,
    constipacao: string,
    dataAvaliacao: string,
    desconfortoAbnominal: string,
    desmaios: string,
    diabete: string,
    diagnosticoOsteopatico: string,
    diagnosticoPorImagem: string,
    diagnosticoTecidual: string,
    diarreia: string,
    dificuldadeMiccao: string,
    diminuicaoMiccao: string,
    disfagia: string,
    dismenorreia: string,
    dispneia: string,
    dorDeGarganta: string,
    dorDuranteMenstruacao: string,
    dorEstomago: string,
    dorPosMenstrual: string,
    dorPreMenstrual: string,
    dorRelacaoSexual: string,
    dorUrinar: string,
    emacional: string,
    edema: string,
    edemaMMII: string,
    edemaMMSS: string,
    eructacao: string,
    esofagite: string,
    estrabismoConvergenteD: string,
    estrabismoConvergenteE: string,
    estrabismoDivergenteD: string,
    estrabismoDivergenteE: string,
    estufamento: string,
    estufamentoAbdominal: string,
    eva: string,
    flatulencia: string,
    frequenciaDor: string,
    fumante: string,
    gastrite: string,
    gordura: string,
    halitose: string,
    hemorroidas: string,
    hepatite: string,
    hernia: string,
    hipertensao: string,
    hipertensaoSistemaCardiorespiratorio: string,
    hipoconvergenciaBilateral: string,
    hipoconvergenciaD: string,
    hipoconvergenciaE: string,
    historicoQueixa: string,
    horarioDor: string,
    infeccaoRim: string,
    infeccoes: string,
    insuficienciaCardiaca: string,
    intolerancia: string,
    lift: string,
    localCicatriz: string,
    localViscera: string,
    maCirculacao: string,
    medicacao: string,
    menstruacaoIrregular: string,
    mordidaCruzadaB: string,
    mordidaCruzadaD: string,
    mordidaCruzadaE: string,
    muitaUrina: string,
    nauseas: string,
    obsEsofago: string,
    obsEstomago: string,
    obsFigado: string,
    obsIntestino: string,
    obsPancreas: string,
    obsProstata: string,
    obsRim: string,
    obsSistemaCardiorespiratorio: string,
    obsUtero: string,
    obsVesiculaBiliar: string,
    oqueMelhoraDor: string,
    oquePioraDor: string,
    outrasQueixas: string,

    peDireito: string,
    peDireitoCavo: string,
    peDireitoPlano: string,
    peDireitoValgo: string,
    peDireitoVaro: string,

    peEsquerdo: string,
    peEsquerdoCavo: string,
    peEsquerdoPlano: string,
    peEsquerdoValgo: string,
    peEsquerdoVaro: string,
    perdaPeso: string,
    perdaPesoFigado: string,
    perdaUrina: string,
    pneumonia: string,
    poucaUrina: string,
    profunda: string,
    qualidadeFezes: string,
    queimacaoUrinar: string,
    queixaPrincipal: string,
    refluxo: string,
    ressaca: string,
    rinite: string,
    sensacaoEvacuacao: string,
    sindromeVasoVagal: string,
    sinusite: string,
    sono: string,
    testeInibicaoATM: string,
    testeInibicaoCicatriz: string,
    testeInibicaoLift: string,
    testeInibicaoOlhos: string,
    testeInibicaoPodal: string,
    testesOrtopedicos: string,
    testesOsteopaticos: string,
    tratamentoDor: string,
    trabalho: string,
    txtLift: string,
    txtTesteInibicaoATM: string,
    txtTesteInibicaoCicatriz: string,
    txtTesteInibicaoLift: string,
    txtTesteInibicaoOlhos: string,
    txtTesteInibicaoPodal: string,
    urinaSangue: string,
    varizes: string
}

export default function EditOsteopatiaPage() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dataAvaliacao: new Date().toISOString().split('T')[ 0 ],
            queixaPrincipal: "",
            historicoQueixa: "",
            outrasQueixas: "",
            caracteristicaDor: "",
            horarioDor: "",
            oquePioraDor: "",
            oqueMelhoraDor: "",
            frequenciaDor: "",
            tratamentoDor: "",
            eva: 0,
            cirurgia: "",

            halitose: false,
            dorDeGarganta: false,
            disfagia: false,
            azia: false,
            tosseSeca: false,
            esofagite: false,
            perdaPeso: false,
            obsEsofago: "",
            diabete: false,
            gordura: false,
            infeccoes: false,
            obsPancreas: "",

            hipertensao: false,
            calculos: false,
            edema: false,
            urinaSangue: false,
            poucaUrina: false,
            muitaUrina: false,
            perdaUrina: false,
            dorUrinar: false,
            queimacaoUrinar: false,
            alteracaoCloracao: false,
            infeccaoRim: false,
            obsRim: "",

            dorEstomago: false,
            eructacao: false,
            refluxo: false,
            hernia: false,
            alimentosAcidos: false,
            estufamento: false,
            nauseas: false,
            gastrite: false,
            obsEstomago: "",

            perdaPesoFigado: false,
            bocaAmarga: false,
            desconfortoAbnominal: false,
            congestaoIntestinal: false,
            alimentosGordurosos: false,
            ressaca: false,
            hepatite: false,
            obsFigado: "",

            medicacao: "",
            alimentacao: "",
            emocional: "",
            sono: "",
            atividadeFisica: "",
            trabalho: "",
            testesOrtopedicos: "",
            testesOsteopaticos: "",
            diagnosticoPorImagem: "",
            diagnosticoTecidual: "",
            diagnosticoOsteopatico: "",

            constipacao: false,
            hemorroidas: false,
            diarreia: false,
            sensacaoEvacuacao: false,
            flatulencia: false,
            qualidadeFezes: false,
            obsIntestino: "",

            estufamentoAbdominal: false,
            intolerancia: false,
            colicas: false,
            calculosBiliares: false,
            obsVesiculaBiliar: "",

            dificuldadeMiccao: false,
            diminuicaoMiccao: false,
            obsProstata: "",

            dorPreMenstrual: false,
            dorDuranteMenstruacao: false,
            dorPosMenstrual: false,
            menstruacaoIrregular: false,
            dorRelacaoSexual: false,
            dismenorreia: false,
            amenorreia: false,
            obsUtero: "",

            arritmia: false,
            angina: false,
            insuficienciaCardiaca: false,
            hipertensaoSistemaCardiorespiratorio: false,
            sindromeVasoVagal: false,
            desmaios: false,
            cansaco: false,
            dispneia: false,
            sinusite: false,
            rinite: false,
            bronquite: false,
            asma: false,
            pneumonia: false,
            fumante: false,
            maCirculacao: false,
            varizes: false,
            edemaMMSS: false,
            edemaMMII: false,
            obsSistemaCardiorespiratorio: "",

            peDireito: "",
            peDireitoVaro: false,
            peDireitoValgo: false,
            peDireitoPlano: false,
            peDireitoCavo: false,

            peEsquerdo: "",
            peEsquerdoVaro: false,
            peEsquerdoValgo: false,
            peEsquerdoPlano: false,
            peEsquerdoCavo: false,
            testeInibicaoPodal: false,
            txtTesteInibicaoPodal: "",

            // classe1: false,
            // classe2: false,
            // aberta: false,
            // profunda: false,
            // classe3: false,
            // mordidaCruzadaD: false,
            // mordidaCruzadaE: false,
            // mordidaCruzadaB: false,
            // ausenciaDeDentes: "",
            // testeInibicaoATM: false,
            // txtTesteInibicaoATM: "",
            // estrabismoConvergenteD: false,
            // estrabismoConvergenteE: false,
            // estrabismoDivergenteD: false,
            // estrabismoDivergenteE: false,
            // hipoconvergenciaD: false,
            // hipoconvergenciaE: false,
            // hipoconvergenciaBilateral: false,
            // testeInibicaoOlhos: false,
            // txtTesteInibicaoOlhos: "",
            // cicatriz: false,
            // localCicatriz: "",
            // testeInibicaoCicatriz: false,
            // txtTesteInibicaoCicatriz: "",
            // lift: false,
            // txtLift: "",
            // localViscera: "",
            // testeInibicaoLift: false,
            // txtTesteInibicaoLift: "",

        }
    })

    const { id } = useParams(); // Captura o parâmetro da rota
    const [ formData, setFormData ] = useState<Osteopatia | null>(null);

    const api = useAPI();
    const { toast } = useToast()
    const router = useRouter();

    const { reset } = form;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/osteopatia/id?id=${id}`);
                const fetchedData = response.data;

                console.log(response.data);

                if (fetchedData) {
                    const { dataAvaliacao, ...rest } = fetchedData;

                    const dadosFormatados = {
                        dataAvaliacao: new Date(dataAvaliacao).toISOString().split("T")[ 0 ],
                        ...rest
                    };

                    form.reset({
                        dataAvaliacao: dadosFormatados.dataAvaliacao,
                        queixaPrincipal: dadosFormatados.queixaPrincipal || "",
                        historicoQueixa: dadosFormatados.historicoQueixa || "",
                        outrasQueixas: dadosFormatados.outrasQueixas || "",
                        caracteristicaDor: dadosFormatados.caracteristicaDor || "",
                        horarioDor: dadosFormatados.horarioDor || "",
                        oquePioraDor: dadosFormatados.oquePioraDor || "",
                        frequenciaDor: dadosFormatados.frequenciaDor || "OUTROS",
                        oqueMelhoraDor: dadosFormatados.oqueMelhoraDor || "",
                        tratamentoDor: dadosFormatados.tratamentoDor || "",
                        cirurgia: dadosFormatados.cirurgia || "",
                        eva: dadosFormatados.eva || "0",
                        medicacao: dadosFormatados.medicacao || "",
                        alimentacao: dadosFormatados.alimentacao || "",
                        emocional: dadosFormatados.emocional || "",
                        sono: dadosFormatados.sono || "",
                        atividadeFisica: dadosFormatados.atividadeFisica || "",
                        trabalho: dadosFormatados.trabalho || "",
                        testesOrtopedicos: dadosFormatados.testesOrtopedicos || "",
                        testesOsteopaticos: dadosFormatados.testesOsteopaticos || "",
                        diagnosticoPorImagem: dadosFormatados.diagnosticoPorImagem || "",
                        diagnosticoTecidual: dadosFormatados.diagnosticoTecidual || "",
                        diagnosticoOsteopatico: dadosFormatados.diagnosticoOsteopatico || "",
                        halitose: dadosFormatados.halitose || false,
                        dorDeGarganta: dadosFormatados.dorDeGarganta || false,
                        disfagia: dadosFormatados.disfagia || false,
                        azia: dadosFormatados.azia || false,
                        tosseSeca: dadosFormatados.tosseSeca || false,
                        esofagite: dadosFormatados.esofagite || false,
                        perdaPeso: dadosFormatados.perdaPeso || false,
                        obsEsofago: dadosFormatados.obsEsofago || "",

                        diabete: dadosFormatados.diabete || false,
                        gordura: dadosFormatados.gordura || false,
                        infeccoes: dadosFormatados.infeccoes || false,
                        obsPancreas: dadosFormatados.obsPancreas || "",

                        estufamentoAbdominal: dadosFormatados.estufamentoAbdominal || false,
                        intolerancia: dadosFormatados.intolerancia || false,
                        colicas: dadosFormatados.colicas || false,
                        calculosBiliares: dadosFormatados.calculosBiliares || false,
                        obsVesiculaBiliar: dadosFormatados.obsVesiculaBiliar || "",

                        dificuldadeMiccao: dadosFormatados.dificuldadeMiccao || false,
                        diminuicaoMiccao: dadosFormatados.diminuicaoMiccao || false,
                        obsProstata: dadosFormatados.obsProstata || "",

                        dorPreMenstrual: dadosFormatados.dorPreMenstrual || false,
                        dorDuranteMenstruacao: dadosFormatados.dorDuranteMenstruacao || false,
                        dorPosMenstrual: dadosFormatados.dorPosMenstrual || false,
                        menstruacaoIrregular: dadosFormatados.menstruacaoIrregular || false,
                        dorRelacaoSexual: dadosFormatados.dorRelacaoSexual || false,
                        dismenorreia: dadosFormatados.dismenorreia || false,
                        amenorreia: dadosFormatados.amenorreia || false,
                        obsUtero: "",

                        constipacao: dadosFormatados.constipacao || false,
                        hemorroidas: dadosFormatados.hemorroidas || false,
                        diarreia: dadosFormatados.diarreia || false,
                        sensacaoEvacuacao: dadosFormatados.sensacaoEvacuacao || false,
                        flatulencia: dadosFormatados.flatulencia || false,
                        qualidadeFezes: dadosFormatados.qualidadeFezes || false,
                        obsIntestino: "",

                        perdaPesoFigado: dadosFormatados.perdaPesoFigado || false,
                        bocaAmarga: dadosFormatados.bocaAmarga || false,
                        desconfortoAbnominal: dadosFormatados.desconfortoAbnominal || false,
                        congestaoIntestinal: dadosFormatados.congestaoIntestinal || false,
                        alimentosGordurosos: dadosFormatados.alimentosGordurosos || false,
                        ressaca: dadosFormatados.ressaca || false,
                        hepatite: dadosFormatados.hepatite || false,
                        obsFigado: "",

                        dorEstomago: dadosFormatados.dorEstomago || false,
                        eructacao: dadosFormatados.eructacao || false,
                        refluxo: dadosFormatados.refluxo || false,
                        hernia: dadosFormatados.hernia || false,
                        alimentosAcidos: dadosFormatados.alimentosAcidos || false,
                        estufamento: dadosFormatados.estufamento || false,
                        nauseas: dadosFormatados.nauseas || false,
                        gastrite: dadosFormatados.gastrite || false,
                        obsEstomago: "",

                        hipertensao: dadosFormatados.hipertensao || false,
                        calculos: dadosFormatados.calculos || false,
                        edema: dadosFormatados.edema || false,
                        urinaSangue: dadosFormatados.urinaSangue || false,
                        poucaUrina: dadosFormatados.poucaUrina || false,
                        muitaUrina: dadosFormatados.muitaUrina || false,
                        perdaUrina: dadosFormatados.perdaUrina || false,
                        dorUrinar: dadosFormatados.dorUrinar || false,
                        queimacaoUrinar: dadosFormatados.queimacaoUrinar || false,
                        alteracaoCloracao: dadosFormatados.alteracaoCloracao || false,
                        infeccaoRim: dadosFormatados.infeccaoRim || false,
                        obsRim: "",

                        arritmia: dadosFormatados.arritmia || false,
                        angina: dadosFormatados.angina || false,
                        insuficienciaCardiaca: dadosFormatados.insuficienciaCardiaca || false,
                        hipertensaoSistemaCardiorespiratorio: dadosFormatados.hipertensaoSistemaCardiorespiratorio || false,
                        sindromeVasoVagal: dadosFormatados.sindromeVasoVagal || false,
                        desmaios: dadosFormatados.desmaios || false,
                        cansaco: dadosFormatados.cansaco || false,
                        dispneia: dadosFormatados.dispneia || false,
                        sinusite: dadosFormatados.sinusite || false,
                        rinite: dadosFormatados.rinite || false,
                        bronquite: dadosFormatados.bronquite || false,
                        asma: dadosFormatados.asma || false,
                        pneumonia: dadosFormatados.pneumonia || false,
                        fumante: dadosFormatados.fumante || false,
                        maCirculacao: dadosFormatados.maCirculacao || false,
                        varizes: dadosFormatados.varizes || false,
                        edemaMMSS: dadosFormatados.edemaMMSS || false,
                        edemaMMII: dadosFormatados.edemaMMII || false,
                        obsSistemaCardiorespiratorio: "",

                        peDireito: dadosFormatados.peDireito || "",
                        peDireitoVaro: dadosFormatados.peDireitoVaro || false,
                        peDireitoValgo: dadosFormatados.peDireitoValgo || false,
                        peDireitoPlano: dadosFormatados.peDireitoPlano || false,
                        peDireitoCavo: dadosFormatados.peDireitoCavo || false,

                        peEsquerdo: dadosFormatados.peEsquerdo || "",
                        peEsquerdoVaro: dadosFormatados.peEsquerdoVaro || false,
                        peEsquerdoValgo: dadosFormatados.peEsquerdoValgo || false,
                        peEsquerdoPlano: dadosFormatados.peEsquerdoPlano || false,
                        peEsquerdoCavo: dadosFormatados.peEsquerdoCavo || false,
                        testeInibicaoPodal: dadosFormatados.testeInibicaoPodal || false,
                        txtTesteInibicaoPodal: dadosFormatados.txtTesteInibicaoPodal || "",
                    })
                }
            } catch (error) {
                toast({
                    duration: 4000,
                    title: "Erro ao carregar avaliação clínica",
                    description: "Não foi possível carregar os dados da avaliação.",
                });
            }
        }

        if (id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ id, reset, toast ]);


    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <DeniedPage />
            </div>
        );
    }

    const handleCancelar = () => {
        router.back(); // Volta para a página anterior
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
    }

    return (
        <div className="text-slate-900 w-full h-auto flex justify-center items-start mt-16">
            <div className="flex flex-col items-center w-11/12">

                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-2">

                        <Tabs defaultValue="anamnese" className=" flex flex-col justify-center w-full">
                            <TabsList className="flex justify-start overflow-x-auto whitespace-nowrap">
                                <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
                                <TabsTrigger value="sistemasViscerais">Sistemas Viscerais</TabsTrigger>
                                <TabsTrigger value="aspectosSociais">Aspectos Sociais</TabsTrigger>
                                <TabsTrigger value="captores">Captores</TabsTrigger>
                                <TabsTrigger value="testesDiagnosticos">Testes e Diagnósticos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="anamnese">
                                <div className="flex flex-col w-1/2">
                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="dataAvaliacao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Data</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="date"
                                                            name="dataAvaliacao"
                                                            className="w-max border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="queixaPrincipal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Queixa principal</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Queixa principal"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="historicoQueixa"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Histórico da queixa</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="outrasQueixas"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Outras queixas</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="caracteristicaDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Característica da dor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Característica da dor"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="horarioDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Horário mais frequênte da dor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Horário mais frequênte da dor"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="oquePioraDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">O que piora a Dor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="O que piora a Dor"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="oqueMelhoraDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">O que melhora a Dor</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="O que melhora a Dor"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="frequenciaDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Frequência</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            {...field}
                                                            value={field.value}
                                                            //defaultValue="COMPARECEU"
                                                            onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-1/3 border p-2 bg-white text-black">
                                                                <SelectValue placeholder="Selecione a frequência" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="OUTROS">OUTROS</SelectItem>
                                                                <SelectItem value="DIARIA">DIÁRIA</SelectItem>
                                                                <SelectItem value="SEMANAL">SEMANAL</SelectItem>
                                                                <SelectItem value="MENSAL">MENSAL</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="tratamentoDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">Tratamentos já realizados</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Tratamentos já realizados"
                                                            className="w-full border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="eva"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="col-span-1 font-semibold">E.V.A. (Escala Visual Analógica)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            // placeholder="Tratamentos já realizados"
                                                            className="w-1/4 border p-2 bg-white text-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="cirurgia"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Cirurgia, traumatismos e partos</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="sistemasViscerais">
                                <div className="w-full">
                                    {/* <h2 className="font-semibold">Esôfago</h2> */}
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Esôfago
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">

                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="halitose" label="Halitose" />
                                                <CheckboxPadrao name="dorDeGarganta" label="Dor de Garganta" />
                                                <CheckboxPadrao name="disfagia" label="Disfagia / Deglutinação" />
                                                <CheckboxPadrao name="azia" label="Azia / Queimação" />
                                                <CheckboxPadrao name="tosseSeca" label="Tosse seca / Pigarro" />
                                                <CheckboxPadrao name="esofagite" label="Esofagite" />
                                                <CheckboxPadrao name="perdaPeso" label="Perda de peso" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsEsofago"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Pâncreas
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">

                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="diabete" label="Diabete / Hipoglicemia" />
                                                <CheckboxPadrao name="gordura" label="Gordura nas fezes" />
                                                <CheckboxPadrao name="infeccoes" label="Infecções no pâncreas" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsPancreas"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 ">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Rim
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="hipertensao" label="Hipertensão" />
                                                <CheckboxPadrao name="calculos" label="Cálculos renais" />
                                                <CheckboxPadrao name="edema" label="Edema generalizado" />
                                                <CheckboxPadrao name="urinaSangue" label="Urina com sangue" />
                                                <CheckboxPadrao name="poucaUrina" label="Pouca urina (Oligúria)" />
                                                <CheckboxPadrao name="muitaUrina" label="Muita urina (Poliúria)" />
                                                <CheckboxPadrao name="perdaUrina" label="Perda de urina" />
                                                <CheckboxPadrao name="dorUrinar" label="Dor para urinar" />
                                                <CheckboxPadrao name="queimacaoUrinar" label="Queimação para urinar" />
                                                <CheckboxPadrao name="alteracaoCloracao" label="Alteração na cloração da urina" />
                                                <CheckboxPadrao name="infeccaoRim" label="Infecção de urina" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsRim"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Estômago
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="dorEstomago" label="Dor epigástrica" />
                                                <CheckboxPadrao name="eructacao" label="Eructação (com o que?)" />
                                                <CheckboxPadrao name="refluxo" label="Refluxo (qual alimento?)" />
                                                <CheckboxPadrao name="hernia" label="Hérnia de hiato" />
                                                <CheckboxPadrao name="alimentosGordurosos" label="Alimentos ácidos (quais?)" />
                                                <CheckboxPadrao name="estufamento" label="Estufamento" />
                                                <CheckboxPadrao name="nauseas" label="Náuseas / Vômitos" />
                                                <CheckboxPadrao name="gastrite" label="Gastrite / Úlceras" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsEstomago"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Fígado
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="perdaPesoFigado" label="Perda de peso" />
                                                <CheckboxPadrao name="bocaAmarga" label="Boca amarga" />
                                                <CheckboxPadrao name="desconfortoAbnominal" label="Desconforto abdominal" />
                                                <CheckboxPadrao name="congestaoIntestinal" label="Congestão intestinal" />
                                                <CheckboxPadrao name="alimentosGordurosos" label="Alimentos gordurosos" />
                                                <CheckboxPadrao name="ressaca" label="Ressaca" />
                                                <CheckboxPadrao name="hepatite" label="Hepatite" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsFigado"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Intestino
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="constipacao" label="Constipação" />
                                                <CheckboxPadrao name="hemorroidas" label="Hemorroidas" />
                                                <CheckboxPadrao name="diarreia" label="Diarreia" />
                                                <CheckboxPadrao name="sensacaoEvacuacao" label="Sensação de evacuação incompleta" />
                                                <CheckboxPadrao name="flatulencia" label="Flatulências" />
                                                <CheckboxPadrao name="qualidadeFezes" label="Qualidade das fezes" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsIntestino"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Vesícula biliar
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="estufamentoAbdominal" label="Estufamento abdominal" />
                                                <CheckboxPadrao name="intolerancia" label="Intolerância a alimentos gordurosos" />
                                                <CheckboxPadrao name="colicas" label="Cólicas" />
                                                <CheckboxPadrao name="calculosBiliares" label="Infecções no pâncreas" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsVesiculaBiliar"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 ">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Próstata
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="dificuldadeMiccao" label="Dificuldade micção" />
                                                <CheckboxPadrao name="diminuicaoMiccao" label="Diminuição da força de micção" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsProstata"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 ">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Ovário / Útero
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">
                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="dorPreMenstrual" label="Dor pré-menstrual" />
                                                <CheckboxPadrao name="dorDuranteMenstruacao" label="Dor durante a menstruação" />
                                                <CheckboxPadrao name="dorPosMenstrual" label="Dor pós-menstrual" />
                                                <CheckboxPadrao name="menstruacaoIrregular" label="Menstruação irregular" />
                                                <CheckboxPadrao name="dorRelacaoSexual" label="Dor na relação sexual" />
                                                <CheckboxPadrao name="dismenorreia" label="Dismenorreia" />
                                                <CheckboxPadrao name="amenorreia" label="Amenorreia" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsUtero"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full mt-2">
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Sistema Cardiorespiratório, Excretor e Hemodinâmico
                                        </div>

                                        <CardContent className="space-y-1 mt-2 pb-2">

                                            <div className="flex flex-wrap gap-4">
                                                <CheckboxPadrao name="arritmia" label="Arritmia / Palpitação" />
                                                <CheckboxPadrao name="angina" label="Angina" />
                                                <CheckboxPadrao name="insuficienciaCardiaca" label="Insuficiência cardiaca" />
                                                <CheckboxPadrao name="hipertensaoSistemaCardiorespiratorio" label="Hipertenção" />
                                                <CheckboxPadrao name="sindromeVasoVagal" label="Sindrome vaso-vagal" />
                                                <CheckboxPadrao name="desmaios" label="Desmaios" />
                                                <CheckboxPadrao name="cansaco" label="Cançaço" />
                                                <CheckboxPadrao name="dispneia" label="Dispnéia" />
                                                <CheckboxPadrao name="sinusite" label="Sinusite" />
                                                <CheckboxPadrao name="rinite" label="Rinite" />
                                                <CheckboxPadrao name="bronquite" label="Bronquite" />
                                                <CheckboxPadrao name="asma" label="Asma" />
                                                <CheckboxPadrao name="pneumonia" label="Pneumonia" />
                                                <CheckboxPadrao name="fumante" label="Fumante" />
                                                <CheckboxPadrao name="maCirculacao" label="Má circulação" />
                                                <CheckboxPadrao name="varizes" label="Varizes" />
                                                <CheckboxPadrao name="edemaMMSS" label="Edema MMSS" />
                                                <CheckboxPadrao name="edemaMMII" label="Edema MMII" />
                                            </div>
                                            <div className="mt-2">
                                                <FormField
                                                    control={form.control}
                                                    name="obsSistemaCardiorespiratorio"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1">Observações</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card >
                                </div>
                            </TabsContent>

                            <TabsContent value="aspectosSociais">
                                <div className="flex flex-col w-1/2">

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="medicacao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Medicação (nome, dosagem)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="nome, dosagem"
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* div com label */}
                                    <Card className="relative border-black mt-4 bg-nubank">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4">
                                            Condições Gerais (Impressão do Terapeuta)
                                        </div>

                                        <CardContent className="space-y-3 mt-2 pb-2">
                                            <div className="mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name="alimentacao"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 font-semibold">Alimentação</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Alimentação"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name="emocional"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 font-semibold">Emocional</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="trabalho, família, amigos"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name="sono"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 font-semibold">Sono</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="qualidade e quantidade de horas"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name="atividadeFisica"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 font-semibold">Atividade física</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Atividade física"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name="trabalho"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="col-span-1 font-semibold">Trabalho</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="stress físico do trabalho"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>
                            </TabsContent>

                            <TabsContent value="captores">
                                <div className="flex flex-col  bg-blue-400 w-1/2">
                                    <Card className="relative border-black mt-4 bg-nubank ">

                                        <div className="absolute -top-3 px-2 text-sm font-bold text-black bg-nubank ml-4 ">
                                            Podal
                                        </div>

                                        <CardContent className="space-y-3 mt-2 pb-2">
                                            <FormLabel className="font-semibold">Pé direito</FormLabel>
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                                {/* Input */}
                                                <FormField
                                                    control={form.control}
                                                    name="peDireito"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full md:w-auto">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Pé direito"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Radio buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    <CheckboxPadrao name="peDireitoVaro" label="Varo" />
                                                    <CheckboxPadrao name="peDireitoValgo" label="Valgo" />
                                                    <CheckboxPadrao name="peDireitoPlano" label="Plano" />
                                                    <CheckboxPadrao name="peDireitoCavo" label="Cavo" />
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardContent className="space-y-3 mt-2 pb-2">
                                            <FormLabel className="font-semibold">Pé esquerdo</FormLabel>
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="peEsquerdo"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full md:w-auto">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Pé esquerdo"
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex flex-wrap gap-2">
                                                    <CheckboxPadrao name="peEsquerdoVaro" label="Varo" />
                                                    <CheckboxPadrao name="peEsquerdoValgo" label="Valgo" />
                                                    <CheckboxPadrao name="peEsquerdoPlano" label="Plano" />
                                                    <CheckboxPadrao name="peEsquerdoCavo" label="Cavo" />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <CheckboxPadrao name="testeInibicaoPodal" label="Teste de Inibição (Se positivo, quais segmentos)" />
                                            </div>

                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name="txtTesteInibicaoPodal"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full md:w-auto">
                                                            {/* <FormLabel className="col-span-1 font-semibold">Pé esquerdo</FormLabel> */}
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="w-full border p-2 bg-white text-black"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="testesDiagnosticos">
                                <div className="flex flex-col w-1/2">
                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="testesOrtopedicos"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Testes Ortopédicos / Neurológicos</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="testesOsteopaticos"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Testes Osteopáticos (disfunções encontradas)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="diagnosticoPorImagem"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Diagnóstico por Imagem (tipo de exame e data)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="diagnosticoTecidual"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Diagnóstico tecidual</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <FormField
                                            control={form.control}
                                            name="diagnosticoOsteopatico"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Diagnóstico osteopático</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="w-full border p-2 bg-white text-black resize-none"
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>
                            </TabsContent>

                        </Tabs>

                        <div className="grid grid-cols-4 gap-4 my-4">
                            <Button
                                type="button"
                                variant={"destructive"}
                                onClick={handleCancelar}
                            >
                                Cancelar / Voltar
                            </Button>

                            <Button type="submit">Salvar</Button>
                        </div>
                    </form>

                </Form>

            </div>
        </div >
    )

}