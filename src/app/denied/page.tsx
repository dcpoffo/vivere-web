import Link from "next/link";

export default function DeniedPage () {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl mb-6">Acesso Restrito</h1>
            <p className="text-base text-slate-600 mb-10">Você não tem permissão para prosseguir</p>
            <Link href={"/"} className="p-4 bg-red-800 text-slate-50 rounded-sm">Voltar</Link>
        </div>
    )
}