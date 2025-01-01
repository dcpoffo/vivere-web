"use client";

import { Suspense } from "react";

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            {children}
        </Suspense>
    );
}
