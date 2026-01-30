
import React, { useState } from 'react';
import { AppLayout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AttendanceDetails } from './components/AttendanceDetails';
import { GradeDetails } from './components/GradeDetails';
import { LMSDashboard } from './components/LMSModule';
import { Login } from './components/Login';
import { UserProfile, Student, Teacher } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (id: string, pass: string) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      // 1. Try Student Login
      const { data: student, error: sError } = await supabase
        .from('students')
        .select('*')
        .eq('reg_no', id)
        .eq('password', pass)
        .maybeSingle();

      if (student) {
        setUser({ ...student, role: 'student' } as Student);
        setIsLoading(false);
        return;
      }

      // 2. Try Teacher Login
      const { data: teacher, error: tError } = await supabase
        .from('teachers')
        .select('*')
        .eq('staff_id', id)
        .eq('password', pass)
        .maybeSingle();

      if (teacher) {
        setUser({ ...teacher, role: 'teacher' } as Teacher);
        setActiveTab('teacher-dashboard');
      } else {
        setAuthError('Invalid Credentials. Check ID or Password.');
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
          <p className="mt-4 text-[#2f7dbd] font-medium animate-pulse uppercase tracking-widest text-xs">Connecting to SIS/LMS Server...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={authError} />;
  }

  const renderContent = () => {
    // Shared content or role-specific routing
    if (activeTab === 'logout') {
      handleLogout();
      return null;
    }

    if (user.role === 'student') {
      switch (activeTab) {
        case 'dashboard': return <Dashboard user={user as Student} />;
        case 'attendance': return <AttendanceDetails studentId={user.id} />;
        case 'marks': return <GradeDetails studentId={user.id} />;
        case 'lms-dashboard': return <LMSDashboard studentId={user.id} />;
        default: break;
      }
    } else {
      switch (activeTab) {
        case 'teacher-dashboard':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-gray-200 shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-xs uppercase font-bold text-gray-500 mt-1 tracking-widest">Active Courses</div>
              </div>
              <div className="bg-white p-6 border border-gray-200 shadow-sm text-center">
                <div className="text-3xl font-bold text-orange-600">12</div>
                <div className="text-xs uppercase font-bold text-gray-500 mt-1 tracking-widest">Pending Grading</div>
              </div>
              <div className="bg-white p-6 border border-gray-200 shadow-sm text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-xs uppercase font-bold text-gray-500 mt-1 tracking-widest">Engagment Rate</div>
              </div>
            </div>
          );
        default: break;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white border border-dashed border-gray-300 rounded-lg">
        <span className="text-lg font-medium">Module Under Development</span>
        <span className="text-sm">Active Tab: {activeTab}</span>
        <button 
          onClick={() => setActiveTab(user.role === 'teacher' ? 'teacher-dashboard' : 'dashboard')}
          className="mt-4 px-6 py-2 bg-[#2f7dbd] text-white rounded font-bold text-xs uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      {renderContent()}
    </AppLayout>
  );
};

export default App;
