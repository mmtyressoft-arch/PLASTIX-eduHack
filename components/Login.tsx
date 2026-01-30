
import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (regNo: string, pass: string) => void;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(regNo, password);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <div className="bg-[#2f7dbd] p-6 text-white text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center p-2">
            <img src="https://picsum.photos/64/64" alt="logo" className="rounded-full" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SIS-KARE Student Portal</h1>
          <p className="text-sm opacity-80 mt-1">University Information System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Register Number</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. 9924008001"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-[#2f7dbd] outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-[#2f7dbd] outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#2f7dbd] text-white py-2.5 font-bold uppercase tracking-widest hover:bg-[#256396] transition-colors shadow-md"
          >
            Login
          </button>
          
          <div className="text-center">
            <a href="#" className="text-xs text-[#2f7dbd] hover:underline">Forgot Password?</a>
          </div>
        </form>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-[10px] text-gray-500 uppercase tracking-widest">
          © 2024 Kalasalingam Academy of Research and Education
        </div>
      </div>
    </div>
  );
};
