
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Search, 
  AlertTriangle, 
  Settings, 
  User, 
  LogOut,
  Home
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rating Summary', href: '/ratings', icon: BarChart3 },
    { name: 'Metric Filter', href: '/metrics', icon: Settings },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Issues', href: '/issues', icon: AlertTriangle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-blue-600">
                ClientCompany
              </div>
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <div className="text-xs text-gray-400">
                Manotr Intelligence
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2024 ClientCompany. All rights reserved.
          </div>
          <div className="text-xs text-gray-400">
            Powered by Manotr Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
