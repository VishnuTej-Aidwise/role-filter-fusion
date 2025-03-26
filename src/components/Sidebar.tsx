
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, FileText, Clock, Users, Settings, LogOut } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface SidebarItemProps {
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, isActive, label }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              "w-full h-12 flex items-center justify-center text-white transition-all duration-200",
              isActive ? "bg-navy-light" : "hover:bg-navy-light"
            )}
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const role = user?.role || 'desk_auditor';
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex h-screen fixed left-0 top-0 z-10">
      <div className="w-[50px] bg-navy flex flex-col items-center py-2">
        <div className="h-8 w-8 bg-navy-light rounded-sm flex items-center justify-center text-white mb-6">
          <ChevronRight size={20} />
        </div>
        
        <div className="flex flex-col items-center space-y-1 flex-1">
          <SidebarItem 
            icon={<FileText size={20} />} 
            href={`/dashboard/${role}`} 
            isActive={isActive('dashboard')} 
            label="Dashboard"
          />
          <SidebarItem 
            icon={<Clock size={20} />} 
            href={`/history/${role}`} 
            isActive={isActive('history')} 
            label="History"
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            href={`/users/${role}`} 
            isActive={isActive('users')} 
            label="Users"
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            href={`/settings/${role}`} 
            isActive={isActive('settings')} 
            label="Settings"
          />
        </div>
        
        <div className="mt-auto mb-4">
          <button 
            onClick={handleLogout} 
            className="w-full h-12 flex items-center justify-center text-white hover:bg-navy-light transition-all duration-200"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
