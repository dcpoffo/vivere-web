import SuspenseWrapper from "@/components/SuspenseWrapper";
import Avaliacoes from "./Avaliacoes";


export default function AvaliacoesWrapper() {
    return (
        <SuspenseWrapper>
            <Avaliacoes />
        </SuspenseWrapper>
    );
}