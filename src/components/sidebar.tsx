'use client';

import {
  Bell,
  Bookmark,
  Home,
  List,
  Mail,
  MoreHorizontal,
  User,
  Users,
  PersonStanding,
  Receipt,
  HandHelping,
  DollarSign,
  BookImage,
  NotepadText,
  NotebookPen
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Pacientes', href: '/pacientes', icon: PersonStanding },
    { label: 'Ficha de Avaliações', href: '/fichaAvaliacoes', icon: NotebookPen },
    { label: 'Fotos de Acompanhamento', href: '/fotos', icon: BookImage },
    { label: 'Mensalidades', href: '/mensalidades', icon: DollarSign },
    { label: 'Avaliações', href: '/avaliacoes', icon: NotepadText },
    { label: 'Osteopatia', href: '/osteopatia', icon: HandHelping },    
    
  ]
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
