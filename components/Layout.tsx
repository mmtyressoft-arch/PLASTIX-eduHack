
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, FileCheck, Settings, CheckSquare, 
  Bell, Flag, Calendar, Briefcase, Monitor, File, ExternalLink, 
  Layout, CreditCard, Home, Truck, Lock, CalendarDays, LogOut,
  ChevronDown, ChevronRight, Menu, User, Circle, BookOpen
} from 'lucide-react';
import { STUDENT_SIDEBAR, TEACHER_SIDEBAR } from '../constants';
import { UserProfile } from '../types';

const iconMap: Record<string, any> = {
  LayoutDashboard, FileText, FileCheck, Settings, CheckSquare, 
  Bell, Flag, Calendar, Briefcase, Monitor, File, ExternalLink, 
  Layout, CreditCard, Home, Truck, Lock, CalendarDays, LogOut, Circle, BookOpen
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
}

const SidebarItem: React.FC<{
  item: any,
  activeTab: string,
  onSelect: (id: string) => void,
  isSub?: boolean
}> = ({ item, activeTab, onSelect, isSub }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[item.icon] || Circle;
  const hasSubItems = !!item.subItems;
  const isActive = activeTab === item.id || (hasSubItems && item.subItems?.some((s: any) => s.id === activeTab));

  return (
    <div>
      <div 
        onClick={() => hasSubItems ? setIsOpen(!isOpen) : onSelect(item.id)}
        className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 border-l-4 ${
          isActive ? 'bg-[#1a2327] border-[#2f7dbd] text-white' : 'border-transparent text-gray-400 hover:bg-[#1a2327] hover:text-white'
        } ${isSub ? 'pl-10 text-sm' : ''}`}
      >
        <Icon size={isSub ? 14 : 18} className="mr-3" />
        <span className="flex-1 text-[13px] font-medium">{item.label}</span>
        {hasSubItems && (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </div>
      {hasSubItems && isOpen && (
        <div className="bg-[#1f292e]">
          {item.subItems?.map((sub: any) => (
            <SidebarItem key={sub.id} item={sub} activeTab={activeTab} onSelect={onSelect} isSub />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppLayout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  const sidebarItems = user.role === 'teacher' ? TEACHER_SIDEBAR : STUDENT_SIDEBAR;

  return (
    <div className="flex min-h-screen">
      <div className="w-[240px] bg-[#263238] fixed h-full overflow-y-auto z-50">
        <div className="h-16 flex items-center px-4 bg-[#2f7dbd] text-white space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 font-bold text-[#2f7dbd]">K</div>
          <div className="font-bold text-lg tracking-tight">LMS-KARE</div>
        </div>
        <div className="p-4 bg-[#1f292e] mb-2">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Logged in as</div>
          <div className="text-white text-xs font-bold truncate">{user.name}</div>
          <div className="text-[#2f7dbd] text-[10px] font-bold uppercase">{user.role}</div>
        </div>
        <nav>
          {sidebarItems.map((item) => (
            <SidebarItem key={item.id} item={item} activeTab={activeTab} onSelect={setActiveTab} />
          ))}
        </nav>
      </div>

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <header className="h-16 bg-[#2f7dbd] text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
          <div className="flex items-center space-x-4">
            <Menu size={20} className="cursor-pointer" />
            <span className="text-sm font-medium hidden sm:inline">Kalasalingam Academy of Research and Education</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs opacity-80 uppercase tracking-widest">{user.role}</div>
              <div className="text-sm font-bold">{(user as any).reg_no || (user as any).staff_id}</div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-white/40">
              <User size={24} className="text-white" />
            </div>
          </div>
        </header>

        <main className="p-4 bg-[#f4f7f9] flex-grow">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
