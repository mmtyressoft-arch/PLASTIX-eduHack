
import React, { useMemo } from 'react';
import { Student } from '../types';
import { Target, Zap, Award } from 'lucide-react';

const CardHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-[#2f7dbd] text-white px-4 py-2.5 font-medium text-base">
    {title}
  </div>
);

export const Dashboard: React.FC<{ user: Student }> = ({ user }) => {
  // Generate a consistent "Random" LMS score based on student reg_no
  const lmsScore = useMemo(() => {
    const seed = parseInt(user.reg_no.slice(-4)) || 500;
    const randomValue = (seed % 30) / 10 + 6.5; // Results in 6.5 to 9.5
    return randomValue.toFixed(1);
  }, [user.reg_no]);

  return (
    <div className="space-y-6">
      {/* Notifications Bar */}
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="bg-[#2f7dbd] text-white px-4 py-2 text-base font-medium">
          Notifications
        </div>
        <div className="bg-[#009688] h-12 flex items-center px-4 text-white text-sm font-medium">
          <Zap size={16} className="mr-2 animate-pulse" />
          Internal Assessment marks for Semester 4 have been updated in SIS.
        </div>
      </div>

      {/* LMS Score and Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-l-4 border-orange-500 shadow-sm p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Overall LMS Score</div>
            <div className="text-3xl font-black text-gray-800">{lmsScore} <span className="text-sm font-bold text-gray-400">/ 10</span></div>
            <div className="text-[10px] text-orange-600 font-bold mt-1">Based on Course Activity</div>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
            <Target size={24} />
          </div>
        </div>

        <div className="bg-white border-l-4 border-blue-500 shadow-sm p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Rank in Section</div>
            <div className="text-3xl font-black text-gray-800">#04</div>
            <div className="text-[10px] text-blue-600 font-bold mt-1">Top 10% of Class</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Award size={24} />
          </div>
        </div>

        <div className="bg-white border-l-4 border-green-500 shadow-sm p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Quiz Completion</div>
            <div className="text-3xl font-black text-gray-800">100%</div>
            <div className="text-[10px] text-green-600 font-bold mt-1">All Tests Attempted</div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <Zap size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Personal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="bg-white shadow-sm border border-gray-200">
          <CardHeader title="Personal Details" />
          <div className="p-0">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  ['Register Number', user.reg_no],
                  ['Aadhar Number', user.aadhar],
                  ['Name of the Student', user.name],
                  ['Degree / Programme', user.degree],
                  ['Batch', user.batch],
                  ['Section', user.section],
                  ['Faculty Advisor', user.faculty_advisor],
                ].map(([label, value], idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 w-1/3 text-gray-600 font-medium border-r">{label}</td>
                    <td className="p-3 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-white shadow-sm border border-gray-200">
          <CardHeader title="Personal Details" />
          <div className="p-0">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  ['Date of birth', user.dob],
                  ['Gender', user.gender],
                  ['Nationality/Religion/Community/Caste', `${user.nationality || 'INDIAN'}/${user.religion || 'HINDU'}/${user.community || 'BC'}/${user.caste || 'N/A'}`],
                  ['Address', user.address],
                ].map(([label, value], idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 w-1/3 text-gray-600 font-medium border-r align-top">{label}</td>
                    <td className="p-3 text-gray-800 whitespace-pre-line">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Notifications */}
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="bg-[#00bcd4] text-white px-4 py-2.5 font-medium text-base">
          Student Notifications
        </div>
        <div className="p-4 space-y-4">
          <div className="p-4 bg-gray-50 border-l-4 border-[#2f7dbd] text-sm text-gray-700">
            Welcome back, {user.name.split(' ')[0]}. Ensure your course registrations are complete.
          </div>
          <div className="p-4 bg-gray-50 border-l-4 border-[#2f7dbd] text-sm text-gray-700">
            Students can access SIS out side the campus using the address http://sis.kalasalingam.ac.in/
          </div>
        </div>
      </div>
    </div>
  );
};
