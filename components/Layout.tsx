import { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { LogOut, Hospital } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { currentUser, logout } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{currentUser?.name} - {currentUser?.role.toUpperCase()}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
