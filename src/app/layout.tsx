import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "../../providers/auth-provider";
import LayoutContent from "./LayoutContent"; // Novo arquivo que cuidará do layout e da sessão
import { PacienteProvider } from "@/context/PacienteContext";

const inter = Inter({ subsets: [ "latin" ] });

export const metadata: Metadata = {
  title: "Vivere web",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>

      <PacienteProvider>

        <html lang="pt-br" className="light">
          <body className={inter.className}>
            <LayoutContent>{children}</LayoutContent>
          </body>
        </html>

      </PacienteProvider>

    </AuthProvider>
  );
}
