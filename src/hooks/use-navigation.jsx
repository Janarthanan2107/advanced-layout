import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  AreaChart,
  Settings,
  Shield,
  FileText,
  Archive,
  BookUser,
  Package,
  Megaphone,
  Boxes,
  Plug,
  LifeBuoy,
} from 'lucide-react';

export const useNavigation = () => {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
    {
      label: 'Customers',
      href: '/customers',
      icon: Users,
      subItems: [
        { label: 'All Customers', href: '/customers', icon: Users },
        { label: 'Segments', href: '/customers/segments', icon: BookUser },
      ],
    },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Marketing', href: '/marketing', icon: Megaphone },
    { label: 'Inventory', href: '/inventory', icon: Boxes },
    { label: 'Integrations', href: '/integrations', icon: Plug },
    { label: 'Analytics', href: '/analytics', icon: AreaChart },
    { label: 'Reports', href: '/reports', icon: FileText, isSecondary: true },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      isSecondary: true,
      subItems: [
        { label: 'General', href: '/settings/general', icon: Settings },
        { label: 'Security', href: '/settings/security', icon: Shield },
        { label: 'Archive', href: '/settings/archive', icon: Archive },
      ],
    },
    { label: 'Help', href: '/help', icon: LifeBuoy, isSecondary: true },
  ];

  return {
    navItems,
  };
};