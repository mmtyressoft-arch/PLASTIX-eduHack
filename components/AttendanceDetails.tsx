
import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AttendanceRecord, DailyAttendance } from '../types';

export const AttendanceDetails: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<DailyAttendance[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: attendance, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId);

      if (!error && attendance) {
        setData(attendance as any[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [studentId]);

  const toggleExpand = async (courseCode: string) => {
    if (expandedCourse === courseCode) {
      setExpandedCourse(null);
      return;
    }

    setExpandedCourse(courseCode);
    setLoadingDaily(true);
    
    const { data: daily, error } = await supabase
      .from('daily_attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .order('date', { ascending: false });

    if (!error && daily) {
      setDailyData(daily as any[]);
    } else {
      setDailyData([]);
    }
    setLoadingDaily(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200">
        <Loader2 className="animate-spin text-[#2f7dbd]" size={40} />
        <p className="mt-4 text-gray-500 text-sm font-medium">Fetching Academic Attendance...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#2f7dbd] text-white px-4 py-2.5 font-medium text-lg flex items-center">
        <CalendarDays className="mr-2" size={20} />
        Attendance Details (Click a course for Daily Log)
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-t border-b border-gray-200">
                <th colSpan={3} className="p-2 border-r text-center font-bold text-gray-700">Course</th>
                <th colSpan={3} className="p-2 border-r text-center font-bold text-gray-700">No of Periods</th>
                <th colSpan={3} className="p-2 border-r text-center font-bold text-gray-700">Leave Availed</th>
                <th rowSpan={2} className="p-2 text-center font-bold text-gray-700">Attendance Percentage</th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left border-r font-bold text-gray-700">View</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Code</th>
                <th className="p-3 text-left border-r font-bold text-gray-700">Name</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Conducted</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Attended</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Onduty</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Medical</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Restricted</th>
                <th className="p-3 text-center border-r font-bold text-gray-700">Extra</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={10} className="p-10 text-center text-gray-400 italic">No attendance records found for this user.</td></tr>
              ) : (
                data.map((row: any) => (
                  <React.Fragment key={row.id}>
                    <tr 
                      onClick={() => toggleExpand(row.course_code)}
                      className={`border-b cursor-pointer transition-colors ${expandedCourse === row.course_code ? 'bg-blue-50' : 'hover:bg-blue-50/30'}`}
                    >
                      <td className="p-3 text-center text-blue-600">
                        {expandedCourse === row.course_code ? <ChevronUp size={18} /> : <PlusCircle size={18} />}
                      </td>
                      <td className="p-3 font-medium text-gray-700">{row.course_code}</td>
                      <td className="p-3 text-gray-700">{row.course_name}</td>
                      <td className="p-3 text-center text-gray-700">{row.conducted}</td>
                      <td className="p-3 text-center text-gray-700">{row.attended}</td>
                      <td className="p-3 text-center text-gray-700">{row.onduty}</td>
                      <td className="p-3 text-center text-gray-700">{row.medical_leave}</td>
                      <td className="p-3 text-center text-gray-700">{row.restricted_holiday}</td>
                      <td className="p-3 text-center text-gray-700">{row.extra_hours || '-'}</td>
                      <td className="p-3 text-center font-bold text-gray-800">{row.percentage}%</td>
                    </tr>
                    
                    {expandedCourse === row.course_code && (
                      <tr className="bg-gray-50">
                        <td colSpan={10} className="p-4 border-b border-gray-200 shadow-inner">
                          <div className="bg-white rounded border border-gray-300 p-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase flex items-center border-b pb-2">
                              <CalendarDays size={16} className="mr-2 text-[#2f7dbd]" />
                              Daily Attendance Log: {row.course_name}
                            </h4>
                            
                            {loadingDaily ? (
                              <div className="flex flex-col items-center justify-center p-6">
                                <Loader2 className="animate-spin text-[#2f7dbd]" size={24} />
                                <span className="text-xs text-gray-400 mt-2">Loading logs...</span>
                              </div>
                            ) : dailyData.length === 0 ? (
                              <div className="text-center p-6 text-gray-500 italic text-sm">
                                No daily attendance records found in the database for this course.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {dailyData.map((day) => (
                                  <div key={day.id} className="flex items-center justify-between p-3 border border-gray-100 rounded bg-white shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[12px] font-bold text-gray-600">
                                        {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </span>
                                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{day.slot}</span>
                                    </div>
                                    <span className={`text-[11px] px-2.5 py-1 rounded font-bold uppercase ${
                                      day.status === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                                      day.status === 'Absent' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                      'bg-blue-100 text-blue-700 border border-blue-200'
                                    }`}>
                                      {day.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
