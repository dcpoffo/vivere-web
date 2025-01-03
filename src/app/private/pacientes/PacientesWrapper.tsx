import SuspenseWrapper from "@/components/SuspenseWrapper";
import Pacientes from "./Pacientes";

export default function PacientesWrapper() {
    return (
        <SuspenseWrapper>
            <Pacientes />
        </SuspenseWrapper>
    );
}
