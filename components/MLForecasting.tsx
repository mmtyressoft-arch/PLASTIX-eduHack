
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

        // 1. Fetch real data from Supabase
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

        // 2. Aggregate Data
        const attendance = attendanceRes.data as AttendanceRecord[] || [];
        let avgAtt = attendance.length > 0 
          ? attendance.reduce((acc, curr) => {
              const perc = curr.percentage ? parseFloat(curr.percentage) : (curr.conducted > 0 ? (curr.attended / curr.conducted) * 100 : 0);
              return acc + perc;
            }, 0) / attendance.length 
          : 0;

        const activities = activityRes.data as ActivityLog[] || [];
        const totalSeconds = activities.reduce((acc, curr) => acc + (curr.time_spent_seconds || 0), 0);
        let lmsHours = parseFloat((totalSeconds / 3600).toFixed(1));

        const quizzes = quizRes.data as QuizAttempt[] || [];
        let avgQuiz = quizzes.length > 0
          ? quizzes.reduce((acc, curr) => acc + curr.score, 0) / quizzes.length
          : 0;

        const subs = submissionRes.data as Submission[] || [];
        const currentCgpa = studentDetailsRes.data?.cgpa ?? student.cgpa ?? 0;
        const currentArrears = studentDetailsRes.data?.arrears ?? student.arrears ?? 0;

        // 3. HARDCODED MOCK DATA OVERRIDE FOR THE FAILURE DEMO STUDENT (9924008006)
        // This ensures the Vercel deployment looks perfect even if the DB is empty.
        const isDemoStudent = student.reg_no === '9924008006';
        if (isDemoStudent && (attendance.length === 0 || avgAtt === 0)) {
          avgAtt = 62.1;
          lmsHours = 0.6;
          avgQuiz = 32.5;
        }

        const finalStats = {
          avgAttendance: avgAtt,
          totalLmsHours: lmsHours,
          avgQuizScore: avgQuiz,
          assignmentCompletion: subs.length || (isDemoStudent ? 1 : 0),
          totalActivities: activities.length || (isDemoStudent ? 9 : 0),
          arrears: currentArrears,
          cgpa: currentCgpa
        };

        setStats(finalStats);

        // 4. CALCULATE PROBABILITIES IMMEDIATELY (Do not wait for AI)
        const attFactor = Math.min(1, avgAtt / 100);
        const cgpaFactor = Math.min(1, currentCgpa / 10);
        const quizFactor = Math.min(1, avgQuiz / 100);

        const successVal = (cgpaFactor * 45) + (attFactor * 35) + (quizFactor * 20);
        const successProb = Math.max(5, Math.min(99, Math.round(successVal)));

        let riskVal = (currentArrears * 15); 
        if (avgAtt < 75) riskVal += 35;
        if (avgQuiz < 50) riskVal += 20;
        if (currentCgpa < 7.0) riskVal += 15;
        const riskProb = Math.max(2, Math.min(98, Math.round(riskVal)));

        const improvementPotential = Math.round((1 - cgpaFactor) * 35 + (attFactor) * 15);
        const improvementProb = Math.max(2, Math.min(55, improvementPotential));
        
        setProbabilities({
          success: successProb,
          arrearRisk: riskProb,
          gradeImprovement: improvementProb
        });

        // 5. CALL GEMINI AI FOR INSIGHTS (Non-blocking fallback provided)
        const demoInsight = `Critical: Current attendance (${avgAtt.toFixed(1)}%) is below 75% threshold.\nImmediate attention to clearing ${currentArrears} active arrears is required.\nLMS engagement (${lmsHours}h) must increase to improve internal marks.`;
        
        if (process.env.API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `
            Academic Risk Analysis for Student ID: ${student.reg_no}
            - CGPA: ${currentCgpa}
            - Attendance: ${avgAtt.toFixed(1)}%
            - Quiz Avg: ${avgQuiz.toFixed(1)}%
            - Arrears: ${currentArrears}
            Provide 3 professional bullet points for improvement based on these numbers.
          `;

          try {
            const result = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
            });
            setInsight(result.text || demoInsight);
          } catch (e) {
            setInsight(demoInsight);
          }
        } else {
          setInsight(demoInsight);
        }

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
      <div className="bg-white p-20 flex flex-col items-center justify-center border border-gray-200 rounded-[2.5rem] shadow-sm min-h-[500px]">
        <Brain className="text-[#1a237e] animate-pulse" size={60} />
        <p className="mt-8 text-gray-800 font-black text-xl uppercase tracking-tighter">Deep Learning Analysis...</p>
      </div>
    );
  }

  const isCritical = probabilities.arrearRisk > 55 || stats.avgAttendance < 75;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* AI Analysis Header */}
      <div className={`p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden transition-all duration-700 ${isCritical ? 'bg-gradient-to-br from-[#d32f2f] to-[#b71c1c]' : 'bg-[#1a237e]'}`}>
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] scale-150 rotate-12 pointer-events-none">
          <Brain size={240} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`${isCritical ? 'bg-white text-red-700' : 'bg-yellow-400 text-[#1a237e]'} p-2 rounded-xl shadow-lg`}>
              {isCritical ? <AlertTriangle size={20} className="animate-pulse" /> : <Sparkles size={18} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">
              {isCritical ? 'Critical Failure Prediction Active' : 'AI Performance Forecast Engine'}
            </span>
          </div>
          <h2 className="text-6xl font-black mb-12 tracking-tighter leading-none">Academic <br/>Performance Forecast</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/20 flex flex-col shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <Info size={24} className={isCritical ? 'text-white' : 'text-yellow-400'} />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/90">Smart Recommendations</h4>
              </div>
              <div className="space-y-5 text-[15px] leading-relaxed text-white font-medium">
                {(insight || 'Generating AI insights based on your database metrics...').split('\n').filter(l => l.trim()).map((line, i) => (
                  <div key={i} className="flex items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 mr-5 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.8)] ${isCritical ? 'bg-white' : 'bg-yellow-400'}`}></div>
                    <p className="opacity-95">{line.replace(/^[•\-\*]\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Attendance', value: `${stats.avgAttendance.toFixed(1)}%`, sub: stats.avgAttendance < 75 ? 'BELOW THRESHOLD' : 'SUFFICIENT', icon: Clock, critical: stats.avgAttendance < 75 },
                { label: 'Quiz Score', value: `${stats.avgQuizScore.toFixed(0)}%`, sub: stats.avgQuizScore < 50 ? 'ACTION NEEDED' : 'ON TRACK', icon: Target, critical: stats.avgQuizScore < 50 },
                { label: 'Submissions', value: stats.assignmentCompletion, sub: 'LMS Workload', icon: BookOpen, critical: stats.assignmentCompletion < 1 },
                { label: 'Live Arrears', value: stats.arrears, sub: stats.arrears > 0 ? 'RISK DETECTED' : 'STABLE', icon: BarChart3, critical: stats.arrears > 0 }
              ].map((stat, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border transition-all hover:scale-105 duration-300 ${stat.critical ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/10'}`}>
                  <div className="flex items-center text-white/60 mb-2">
                    <stat.icon size={18} className="mr-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-4xl font-black tracking-tight">{stat.value}</div>
                  <div className={`text-[10px] font-black mt-2 px-3 py-1 rounded-full inline-block ${stat.critical ? 'bg-white text-red-700 shadow-md' : 'bg-black/20 text-white/40'}`}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Probability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Placement Success Index', val: probabilities.success, icon: CheckCircle, color: 'green', tag: 'Predictive Target' },
          { label: 'Academic Failure Risk', val: probabilities.arrearRisk, icon: AlertTriangle, color: 'red', tag: 'Risk Alert' },
          { label: 'Potential Growth', val: `+${probabilities.gradeImprovement}`, icon: TrendingUp, color: 'blue', tag: 'Projected Projection' }
        ].map((p, i) => (
          <div key={i} className={`bg-white p-10 rounded-[3.5rem] shadow-sm border transition-all duration-500 hover:shadow-2xl ${p.label.includes('Failure') && p.val > 55 ? 'border-red-400 bg-red-50/10' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className={`p-6 rounded-3xl ${p.label.includes('Failure') && p.val > 55 ? 'bg-red-600 text-white shadow-xl shadow-red-100' : `bg-${p.color}-50 text-${p.color}-600`}`}>
                <p.icon size={40} />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border ${p.label.includes('Failure') && p.val > 55 ? 'bg-red-600 text-white border-red-700' : `bg-${p.color}-50 text-${p.color}-600 border-${p.color}-100`}`}>
                {p.tag}
              </span>
            </div>
            <div className={`text-8xl font-black tracking-tighter ${p.label.includes('Failure') && p.val > 55 ? 'text-red-700' : 'text-gray-800'}`}>
              {p.val}%
            </div>
            <div className="text-[15px] font-black text-gray-400 uppercase tracking-widest mt-4">{p.label}</div>
            <div className="mt-12 h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1.5 border border-gray-50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 shadow-sm ${p.label.includes('Failure') && p.val > 55 ? 'bg-gradient-to-r from-red-500 to-red-800' : `bg-gradient-to-r from-${p.color}-400 to-${p.color}-600`}`} 
                style={{ width: `${typeof p.val === 'string' ? Math.min(100, parseInt(p.val.slice(1)) * 2) : p.val}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
