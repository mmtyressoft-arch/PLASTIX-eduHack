
import React, { useState } from 'react';
import { AppLayout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AttendanceDetails } from './components/AttendanceDetails';
import { GradeDetails } from './components/GradeDetails';
import { Login } from './components/Login';
import { Student } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<Student | null>(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (regNo: string, pass: string) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('reg_no', regNo)
        .eq('password', pass)
        .single();

      if (error || !data) {
        setAuthError('Invalid Register Number or Password.');
      } else {
        setUser(data as Student);
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#2f7dbd] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#2f7dbd] font-medium animate-pulse uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={authError} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'attendance':
        return <AttendanceDetails studentId={user.id} />;
      case 'grade':
        return <GradeDetails studentId={user.id} />;
      case 'logout':
        handleLogout();
        return null;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white border border-dashed border-gray-300 rounded-lg">
            <span className="text-lg font-medium">Module under development</span>
            <span className="text-sm">Current Active Tab: {activeTab}</span>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-4 px-4 py-2 bg-[#2f7dbd] text-white rounded hover:bg-opacity-90 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <AppLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user}
    >
      {renderContent()}
    </AppLayout>
  );
};

export default App;
