'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const routes = [
    { name: 'Home', path: '/' },
    { name: 'Cadastro', path: '/private/pacientes' },
    { name: 'Atendimentos', path: '/private/atendimentos' },
    { name: 'Mensalidades', path: '/private/mensalidades' },
];

export default function Navegacao() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="fixed top-0 left-0 w-full">
            <Tabs
                value={routes.find((route) => route.path !== '/' && pathname.startsWith(route.path))?.path || '/'}
                onValueChange={(value) => router.push(value)}
                className="w-full "
            >
                <TabsList className="flex gap-4">
                    {routes.map((route) => (
                        <TabsTrigger key={route.path} value={route.path}>
                            {route.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
