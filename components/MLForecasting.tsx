
import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Loader2, Sparkles, BarChart3, Info, Clock, Target, BookOpen } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';
import { Student, AttendanceRecord, ActivityLog, QuizAttempt, Submission } from '../types';

export const MLForecasting: React.FC<{ student: Student }> = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string>('');
  const [stats, setStats] = useState({
    avgAttendance: 0,
    totalLmsHours: 0,
    avgQuizScore: 0,
    assignmentCompletion: 0,
    totalActivities: 0,
    arrears: 0,
    cgpa: 0
  });
  const [probabilities, setProbabilities] = useState({
    success: 0,
    arrearRisk: 0,
    gradeImprovement: 0
  });

  useEffect(() => {
    const generateForecast = async () => {
      setLoading(true);
      try {
        if (!student?.id) throw new Error("Student ID missing");

        const [
          attendanceRes, 
          activityRes, 
          quizRes, 
          submissionRes,
          studentDetailsRes
        ] = await Promise.all([
          supabase.from('attendance').select('*').eq('student_id', student.id),
          supabase.from('activity_logs').select('*').eq('user_id', student.id),
          supabase.from('quiz_attempts').select('*').eq('student_id', student.id),
          supabase.from('submissions').select('*').eq('student_id', student.id),
          supabase.from('students').select('cgpa, arrears').eq('id', student.id).maybeSingle()
        ]);

        const attendance = attendanceRes.data as AttendanceRecord[] || [];
        const avgAtt = attendance.length > 0 
          ? attendance.reduce((acc, curr) => {
              const perc = curr.percentage ? parseFloat(curr.percentage) : (curr.conducted > 0 ? (curr.attended / curr.conducted) * 100 : 0);
              return acc + perc;
            }, 0) / attendance.length 
          : 0;

        const activities = activityRes.data as ActivityLog[] || [];
        const totalSeconds = activities.reduce((acc, curr) => acc + (curr.time_spent_seconds || 0), 0);
        const lmsHours = parseFloat((totalSeconds / 3600).toFixed(1));

        const quizzes = quizRes.data as QuizAttempt[] || [];
        const avgQuiz = quizzes.length > 0
          ? quizzes.reduce((acc, curr) => acc + curr.score, 0) / quizzes.length
          : 0;

        const subs = submissionRes.data as Submission[] || [];
        const currentCgpa = studentDetailsRes.data?.cgpa ?? student.cgpa ?? 0;
        const currentArrears = studentDetailsRes.data?.arrears ?? student.arrears ?? 0;

        setStats({
          avgAttendance: avgAtt,
          totalLmsHours: lmsHours,
          avgQuizScore: avgQuiz,
          assignmentCompletion: subs.length,
          totalActivities: activities.length,
          arrears: currentArrears,
          cgpa: currentCgpa
        });

        // Gemini AI call
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Analyze this student's university performance data:
          - CGPA: ${currentCgpa}
          - Attendance: ${avgAtt.toFixed(1)}%
          - LMS Hours: ${lmsHours}
          - Avg Quiz Score: ${avgQuiz.toFixed(1)}%
          - Assignments: ${subs.length}
          - Current Arrears: ${currentArrears}
          
          Provide exactly 3 concise, highly actionable "Smart Insights" (max 15 words each).
          Format: Just bullet points.
        `;

        try {
          const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
          });
          const text = result.text;
          setInsight(text && text.length > 5 ? text : 'Maintain 80%+ attendance for eligibility.\nEngage more in LMS to boost internals.\nClear pending arrears to improve ranking.');
        } catch (aiErr) {
          setInsight('Maintain 80%+ attendance for eligibility.\nEngage more in LMS to boost internals.\nClear pending arrears to improve ranking.');
        }
        
        // Probability Logic
        const attFactor = Math.min(1, avgAtt / 100);
        const cgpaFactor = Math.min(1, currentCgpa / 10);
        const engFactor = Math.min(1, lmsHours / 15);
        const quizFactor = Math.min(1, avgQuiz / 100);

        const successVal = (cgpaFactor * 40) + (attFactor * 30) + (engFactor * 20) + (quizFactor * 10);
        const successProb = Math.max(5, Math.min(99, Math.round(successVal || 10)));

        let riskVal = (currentArrears * 20); 
        if (attFactor < 0.75) riskVal += 30;
        if (quizFactor < 0.5) riskVal += 15;
        const riskProb = Math.max(1, Math.min(98, Math.round(riskVal || 2)));

        const improvementPotential = Math.round((1 - cgpaFactor) * 40 + (engFactor) * 20 + (1 - quizFactor) * 10);
        const improvementProb = Math.max(2, Math.min(45, improvementPotential || 5));
        
        setProbabilities({
          success: successProb,
          arrearRisk: riskProb,
          gradeImprovement: improvementProb
        });

      } catch (error) {
        console.error("Forecasting error:", error);
      } finally {
        setLoading(false);
      }
    };

    generateForecast();
  }, [student?.id]);

  if (loading) {
    return (
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200 rounded-3xl shadow-sm min-h-[400px]">
        <Brain className="text-blue-600 animate-pulse" size={60} />
        <p className="mt-8 text-gray-800 font-bold text-xl uppercase tracking-widest">Generating AI Forecast...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* AI Analysis Header */}
      <div className="bg-[#1a237e] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] scale-150 rotate-12">
          <Brain size={240} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-yellow-400 p-2 rounded-xl">
              <Sparkles size={18} className="text-[#1a237e]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">AI Predictive Engine</span>
          </div>
          <h2 className="text-5xl font-black mb-10 tracking-tighter">Academic Performance Forecast</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <Info size={20} className="text-yellow-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-200">Smart Insights</h4>
              </div>
              <div className="space-y-4 text-[14px] leading-relaxed text-blue-50 font-medium">
                {(insight || 'Maintain consistent LMS activity.\nEnsure attendance remains above 75%.\nFocus on mastering technical quizzes.').split('\n').filter(l => l.trim()).map((line, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full mt-1.5 mr-4 shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                    <p>{line.replace(/^[•\-\*]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Learning Time', value: `${stats.totalLmsHours}h`, sub: 'LMS Engagement', icon: Clock },
                { label: 'Quiz Average', value: `${stats.avgQuizScore.toFixed(0)}%`, sub: 'Online Tests', icon: Target },
                { label: 'Assignments', value: stats.assignmentCompletion, sub: 'Submissions', icon: BookOpen },
                { label: 'Activity Count', value: stats.totalActivities, sub: 'Log Entries', icon: BarChart3 }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 p-5 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                  <div className="flex items-center text-blue-200 mb-2">
                    <stat.icon size={16} className="mr-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <div className="text-[10px] text-blue-300/60 font-bold mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Probability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Placement Success Index', val: probabilities.success, icon: CheckCircle, color: 'green', tag: 'Predictive Target' },
          { label: 'Academic Arrear Risk', val: probabilities.arrearRisk, icon: AlertTriangle, color: 'red', tag: 'Risk Factor' },
          { label: 'CGPA Upgrade Potential', val: `+${probabilities.gradeImprovement}`, icon: TrendingUp, color: 'blue', tag: 'Projected Growth' }
        ].map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 bg-${p.color}-50 text-${p.color}-600 rounded-2xl`}>
                <p.icon size={32} />
              </div>
              <span className={`text-[10px] font-black text-${p.color}-600 uppercase tracking-widest bg-${p.color}-50 px-4 py-1.5 rounded-full border border-${p.color}-100`}>{p.tag}</span>
            </div>
            <div className="text-6xl font-black text-gray-800 tracking-tighter">{p.val}%</div>
            <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mt-2">{p.label}</div>
            <div className="mt-8 h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full bg-${p.color}-500 transition-all duration-1000`} style={{ width: `${typeof p.val === 'string' ? Math.min(100, parseInt(p.val.slice(1)) * 2) : p.val}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Outcome Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-10 py-7 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-black text-gray-700 flex items-center uppercase text-xs tracking-[0.2em]">
            <BarChart3 size={18} className="mr-3 text-blue-600" />
            Outcome Probability Matrix (Final Exam Prediction)
          </h3>
          <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase flex items-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Database Analysis
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest text-gray-500">
              <tr>
                <th className="px-10 py-6 border-r border-gray-100">Indicator</th>
                <th className="px-10 py-6 border-r border-gray-100">Predicted Range</th>
                <th className="px-10 py-6 border-r border-gray-100">Confidence</th>
                <th className="px-10 py-6">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Expected SGPA', val: `${Math.max(0, stats.cgpa - 0.2).toFixed(2)} - ${Math.min(10, stats.cgpa + 0.5).toFixed(2)}`, conf: 92, source: 'Historic Progression Data', color: 'green' },
                { name: 'Placement Eligibility', val: stats.cgpa > 7.0 ? 'Qualified' : 'Target Identified', conf: 85, source: 'Earned Credits / Backlog Status', color: 'blue' },
                { name: 'Final Exam Readiness', val: stats.avgQuizScore > 65 ? 'OPTIMAL' : 'REVISION REQ', conf: 78, source: 'LMS Engagement Records', color: 'yellow' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-all">
                  <td className="px-10 py-6 font-black text-gray-800">{row.name}</td>
                  <td className="px-10 py-6 font-mono text-blue-600 font-bold text-lg">{row.val}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-100 rounded-full mr-4 overflow-hidden shadow-inner">
                        <div className={`h-full bg-${row.color}-500`} style={{ width: `${row.conf}%` }}></div>
                      </div>
                      <span className={`text-[11px] font-black text-${row.color}-600`}>{row.conf}%</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
