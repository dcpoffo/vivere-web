import SuspenseWrapper from "@/components/SuspenseWrapper";
import Mensalidades from "./Mensalidades";

export default function MensalidadesWrapper() {
    return (
        <SuspenseWrapper>
            <Mensalidades />
        </SuspenseWrapper>
    );
}
