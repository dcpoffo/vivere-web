import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function DeniedPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center">

            <div className="flex gap-4 justify-center items-center">
                <TriangleAlert size={48} color="red" />
                <h1 className="text-3xl">Acesso Restrito</h1>
                <TriangleAlert size={48} color="red" />
            </div>

            <div className="flex p-8">Você não tem permissão para prosseguir</div>

            <Link href={"/login"} className="p-3 bg-red-500 text-slate-50 rounded-sm">Voltar</Link>

        </div>
    )
}