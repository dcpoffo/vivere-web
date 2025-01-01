import SuspenseWrapper from "@/components/SuspenseWrapper";
import Atendimentos from "./Atendimentos";

export default function MensalidadesWrapper() {
    return (
        <SuspenseWrapper>
            <Atendimentos />
        </SuspenseWrapper>
    );
}