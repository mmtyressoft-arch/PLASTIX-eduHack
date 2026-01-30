
import React, { useState, useEffect } from 'react';
import { Eye, Loader2, GraduationCap, Calculator, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GradeRecord, CreditRequirement } from '../types';

export const GradeDetails: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [credits, setCredits] = useState<CreditRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [gradeRes, creditRes] = await Promise.all([
        supabase.from('grades').select('*').eq('student_id', studentId).order('semester', { ascending: true }),
        supabase.from('credit_requirements').select('*').eq('student_id', studentId)
      ]);

      if (gradeRes.data) setGrades(gradeRes.data as any[]);
      if (creditRes.data) setCredits(creditRes.data as any[]);
      setLoading(false);
    };

    fetchData();
  }, [studentId]);

  // SGPA Calculation logic
  const calculateStats = () => {
    const semStats: Record<number, { totalPoints: number; totalCredits: number; sgpa: number }> = {};
    let grandTotalPoints = 0;
    let grandTotalCredits = 0;

    grades.forEach(g => {
      if (!semStats[g.semester]) {
        semStats[g.semester] = { totalPoints: 0, totalCredits: 0, sgpa: 0 };
      }
      const points = Number(g.credits) * Number(g.grade_points);
      semStats[g.semester].totalPoints += points;
      semStats[g.semester].totalCredits += Number(g.credits);
      
      grandTotalPoints += points;
      grandTotalCredits += Number(g.credits);
    });

    Object.keys(semStats).forEach(sem => {
      const s = semStats[Number(sem)];
      s.sgpa = s.totalCredits > 0 ? Number((s.totalPoints / s.totalCredits).toFixed(2)) : 0;
    });

    const cgpa = grandTotalCredits > 0 ? Number((grandTotalPoints / grandTotalCredits).toFixed(2)) : 0;

    return { semStats, cgpa, grandTotalCredits };
  };

  const { semStats, cgpa, grandTotalCredits } = calculateStats();

  if (loading) {
    return (
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200">
        <Loader2 className="animate-spin text-[#2f7dbd]" size={40} />
        <p className="mt-4 text-gray-500 text-sm font-medium">Calculating Academic Performance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CGPA Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full text-[#2f7dbd]">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Overall CGPA</div>
            <div className="text-2xl font-bold text-gray-800">{cgpa.toFixed(2)}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <Calculator size={24} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Earned Credits</div>
            <div className="text-2xl font-bold text-gray-800">{grandTotalCredits.toFixed(1)}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Academic Status</div>
            <div className="text-2xl font-bold text-gray-800">Regular</div>
          </div>
        </div>
      </div>

      {/* Main Grades Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#2f7dbd] text-white px-4 py-2.5 font-medium text-lg flex items-center">
          <GraduationCap className="mr-2" size={20} />
          Academic Performance Summary
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 text-left border-r font-bold text-gray-700">S.No</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Sem</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Course Code</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Course Name</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Credits</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Points</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Grade</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Category</th>
                <th className="p-3 text-left font-bold text-gray-700">Exam Period</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={9} className="p-10 text-center text-gray-400 italic">No academic history available.</td></tr>
              ) : (
                grades.map((row: any, idx) => {
                  const isLastInSem = idx === grades.length - 1 || grades[idx + 1].semester !== row.semester;
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr className="border-b last:border-0 hover:bg-blue-50/20 transition-colors">
                        <td className="p-3 border-r text-gray-600 font-medium">{idx + 1}</td>
                        <td className="p-3 border-r text-gray-700 font-bold">{row.semester}</td>
                        <td className="p-3 border-r text-[#2f7dbd] font-bold">{row.course_code}</td>
                        <td className="p-3 border-r text-gray-700">{row.course_name}</td>
                        <td className="p-3 border-r text-center text-gray-700">{row.credits}</td>
                        <td className="p-3 border-r text-center text-gray-700">{row.grade_points}</td>
                        <td className="p-3 border-r text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.grade === 'S' || row.grade === 'A' ? 'bg-green-100 text-green-700' :
                            row.grade === 'B' || row.grade === 'C' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {row.grade}
                          </span>
                        </td>
                        <td className="p-3 border-r text-gray-700 uppercase">{row.category}</td>
                        <td className="p-3 text-gray-500 italic">{row.exam_month_year}</td>
                      </tr>
                      {isLastInSem && (
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={4} className="p-2 text-right font-bold text-gray-600 border-r">Semester {row.semester} Performance:</td>
                          <td className="p-2 text-center font-bold text-gray-800 border-r">{semStats[row.semester].totalCredits.toFixed(1)}</td>
                          <td colSpan={4} className="p-2 pl-4 font-bold text-[#2f7dbd]">
                            SGPA: <span className="text-lg ml-2">{semStats[row.semester].sgpa.toFixed(2)}</span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Summary Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#2f7dbd] text-white px-4 py-2 text-sm font-bold uppercase">
          Credit Requirement Summary
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 text-left border-r font-bold text-gray-700">Category</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Min Credit Req</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Studied</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Earned</th>
                <th className="p-3 text-center font-bold text-gray-700">To Be Earned</th>
              </tr>
            </thead>
            <tbody>
              {credits.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No data</td></tr>
              ) : (
                credits.map((row: any) => (
                  <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 border-r text-gray-700 font-medium">{row.category}</td>
                    <td className="p-3 border-r text-center text-gray-700">{row.min_credits}</td>
                    <td className="p-3 border-r text-center text-gray-700">{row.studied}</td>
                    <td className="p-3 border-r text-center text-gray-700">{row.earned}</td>
                    <td className="p-3 text-center text-[#2f7dbd] flex items-center justify-center space-x-1 font-bold">
                      <span>{row.to_be_earned}</span>
                      <div className="flex items-center text-[10px] cursor-pointer hover:underline text-gray-400 font-normal">
                        (<Eye size={12} className="mx-0.5" /> View)
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
