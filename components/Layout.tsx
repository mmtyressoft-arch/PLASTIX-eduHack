
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, FileCheck, Settings, CheckSquare, 
  Bell, Flag, Calendar, Briefcase, Monitor, File, ExternalLink, 
  Layout, CreditCard, Home, Truck, Lock, CalendarDays, LogOut,
  ChevronDown, ChevronRight, Menu, User, Circle
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants';
import { Student } from '../types';

const iconMap: Record<string, any> = {
  LayoutDashboard, FileText, FileCheck, Settings, CheckSquare, 
  Bell, Flag, Calendar, Briefcase, Monitor, File, ExternalLink, 
  Layout, CreditCard, Home, Truck, Lock, CalendarDays, LogOut, Circle
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: Student;
}

const SidebarItem: React.FC<{
  item: typeof SIDEBAR_ITEMS[0],
  activeTab: string,
  onSelect: (id: string) => void,
  isSub?: boolean
}> = ({ item, activeTab, onSelect, isSub }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[item.icon] || Circle;
  const hasSubItems = !!item.subItems;
  const isActive = activeTab === item.id || (hasSubItems && item.subItems?.some(s => s.id === activeTab));

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
        {item.isNew && (
          <span className="bg-red-600 text-white text-[10px] px-1 rounded font-bold mr-2">NEW</span>
        )}
        {hasSubItems && (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </div>
      {hasSubItems && isOpen && (
        <div className="bg-[#1f292e]">
          {item.subItems?.map(sub => (
            <SidebarItem key={sub.id} item={sub} activeTab={activeTab} onSelect={onSelect} isSub />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppLayout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#263238] fixed h-full overflow-y-auto z-50">
        <div className="h-16 flex items-center px-4 bg-[#2f7dbd] text-white space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src="https://picsum.photos/40/40" alt="logo" className="rounded-full" />
          </div>
          <div className="font-bold text-lg tracking-tight">SIS-KARE</div>
        </div>
        <nav className="mt-2">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem 
              key={item.id} 
              item={item} 
              activeTab={activeTab} 
              onSelect={setActiveTab} 
            />
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-[#2f7dbd] text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
          <div className="flex items-center space-x-4">
            <Menu size={20} className="cursor-pointer" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs opacity-80 uppercase tracking-widest">Student</div>
              <div className="text-sm font-bold">{user.reg_no}</div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-white/40">
              <User size={24} className="text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 bg-[#f4f7f9] flex-grow">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
