
import React from 'react';
import { Student } from '../types';

const CardHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-[#2f7dbd] text-white px-4 py-2.5 font-medium text-base">
    {title}
  </div>
);

export const Dashboard: React.FC<{ user: Student }> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Notifications Bar */}
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="bg-[#2f7dbd] text-white px-4 py-2 text-base font-medium">
          Notifications
        </div>
        <div className="bg-[#009688] h-12 flex items-center px-4 text-white text-sm">
          {/* Status bar */}
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
