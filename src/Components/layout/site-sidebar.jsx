'use client';

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { Fingerprint } from 'lucide-react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from '../themeProvider';

export function SiteSidebar({ menuItems }) {
  const location = useLocation();
  const { state: sidebarState, isMobile } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const { theme, setTheme, mounted } = useTheme();

  const isCollapsed = sidebarState === 'collapsed' && !isMobile;

  useEffect(() => {
    if (isCollapsed) {
      setOpenSubmenus({});
      return;
    }

    const newOpenState = {};
    for (const item of menuItems) {
      if (item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.href))) {
        newOpenState[item.label] = true;
      }
    }
    setOpenSubmenus(newOpenState);
  }, [location.pathname, menuItems, isCollapsed]);

  const toggleSubmenu = (label, isOpen) => {
    if (isOpen) {
      setOpenSubmenus({ [label]: true });
    } else {
      setOpenSubmenus(prev => ({ ...prev, [label]: false }));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const mainNav = menuItems.filter(item => !item.isSecondary);
  const secondaryNav = menuItems.filter(item => item.isSecondary);

  const renderNavItems = (items) => {
    return items.map((item) => {
      const isActive = (item.href ? location.pathname.startsWith(item.href) &&
        (item.href !== '/dashboard' || location.pathname === '/dashboard') : false) ||
        (item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.href)));
      const isSubmenuOpen = openSubmenus[item.label] || false;

      if (item.subItems && isCollapsed) {
        return (
          <SidebarMenuItem key={item.label}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.label}
                    className="w-full justify-center"
                  >
                    {item.icon && <item.icon className="h-6 w-6" />}
                    <span className="sr-only">{item.label}</span>
                  </SidebarMenuButton>
                  {/* {isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-lg" />} */}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" sideOffset={10}>
                <DropdownMenuItem asChild>
                  <span className="px-2 py-1 font-semibold text-base">{item.label}</span>
                </DropdownMenuItem>
                {item.subItems.map((subItem) => (
                  <DropdownMenuItem key={subItem.label} asChild>
                    <Link to={subItem.href} className="flex items-center gap-2 cursor-pointer">
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      <span>{subItem.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        );
      }

      return item.subItems ? (
        <SidebarMenuItem key={item.label}>
          <Collapsible
            open={isSubmenuOpen}
            onOpenChange={(isOpen) => toggleSubmenu(item.label, isOpen)}
          >
            <CollapsibleTrigger asChild>
              <div className="relative">
                <SidebarMenuButton
                  className="w-full justify-between"
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <div className=" w-full flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[collapsible=icon]:hidden data-[state=open]:rotate-90"
                    data-state={isSubmenuOpen ? 'open' : 'closed'}
                  />
                </SidebarMenuButton>
                {/* {isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-lg" />} */}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <SidebarMenuSub data-state={openSubmenus[item.label] ? 'open' : 'closed'} className="mt-2 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton asChild isActive={location.pathname === subItem.href}>
                      <Link to={subItem.href}>
                        <span>{subItem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      ) : (
        <SidebarMenuItem key={item.label}>
          <div className="relative">
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
              <Link to={item.href}>
                {item.icon && <item.icon className="h-6 w-6 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-5" />}
                <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
            {/* {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-lg group-data-[collapsible=icon]:left-0" />} */}
          </div>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar collapsible="icon" className=' text-white'>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Fingerprint className="h-7 w-7 text-primary" />
          <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">
            HrBuddie
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {renderNavItems(mainNav)}
          </SidebarMenu>
        </SidebarGroup>
        {secondaryNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Tools & Settings</SidebarGroupLabel>
            <SidebarMenu>
              {renderNavItems(secondaryNav)}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {mounted && (
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col" onClick={toggleTheme}>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 group-data-[collapsible=icon]:w-full"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="group-data-[collapsible=icon]:hidden text-sm text-white cursor-pointer">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}