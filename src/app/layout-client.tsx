"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {pathname !== '/' && <Header />}
            <main className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">
                {children}
            </main>
        </>
    );
}
