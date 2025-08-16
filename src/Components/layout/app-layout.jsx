'use client';

import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { SiteHeader } from './site-header.jsx';
import { SiteSidebar } from './site-sidebar.jsx';
import { useNavigation } from '../../hooks/use-navigation';

export function AppLayout({ children }) {
  const { navItems } = useNavigation();

  return (
    <SidebarProvider>
      <SiteSidebar menuItems={navItems} />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}