
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, FileText, Clock, Users, Settings } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "w-full h-14 flex items-center justify-center text-white transition-all duration-200",
        isActive ? "bg-navy-light" : "hover:bg-navy-light"
      )}
    >
      {icon}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const role = user?.role || 'desk_auditor';
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen fixed left-0 top-0">
      <div className="w-[55px] bg-navy flex flex-col items-center py-2">
        <div className="h-10 w-10 bg-navy-light rounded-sm flex items-center justify-center text-white mb-8">
          <ChevronRight size={24} />
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <SidebarItem 
            icon={<FileText size={24} />} 
            href={`/dashboard/${role}`} 
            isActive={isActive('dashboard')} 
          />
          <SidebarItem 
            icon={<Clock size={24} />} 
            href={`/history/${role}`} 
            isActive={isActive('history')} 
          />
          <SidebarItem 
            icon={<Users size={24} />} 
            href={`/users/${role}`} 
            isActive={isActive('users')} 
          />
          <SidebarItem 
            icon={<Settings size={24} />} 
            href={`/settings/${role}`} 
            isActive={isActive('settings')} 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
