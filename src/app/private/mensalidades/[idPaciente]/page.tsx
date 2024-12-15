"use client";

import { useParams } from "next/navigation";

export default function Mensalidades() {
  const { idPaciente } = useParams();
  return (
    <div className="flex justify-start w-full">
      <h1>Mensalidade do Paciente {idPaciente}</h1>
    </div>
  );
}