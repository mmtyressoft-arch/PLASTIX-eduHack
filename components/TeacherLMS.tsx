
import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Users, BookOpen, Clock, 
  ExternalLink, CheckCircle2, AlertCircle, 
  Check, X, Loader2, ArrowRight, BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Teacher, Course, Submission, Student } from '../types';

export const TeacherDashboard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSub, setGradingSub] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Get Teacher's Courses
      const { data: assignments } = await supabase
        .from('teaching_assignments')
        .select('courses(*)')
        .eq('teacher_id', teacher.id);
      
      const teacherCourses = (assignments || []).map((a: any) => a.courses);
      setCourses(teacherCourses);

      // 2. Get Pending Submissions for these courses
      const courseCodes = teacherCourses.map(c => c.course_code);
      if (courseCodes.length > 0) {
        const { data: subs } = await supabase
          .from('submissions')
          .select(`
            *,
            student:students(*),
            assignment:assignments(*)
          `)
          .in('assignment(course_code)', courseCodes)
          .eq('status', 'Pending')
          .order('submitted_at', { ascending: true });
        setSubmissions(subs || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [teacher.id]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Courses</div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-blue-600">{courses.length}</span>
            <BookOpen className="text-blue-100" size={40} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Pending Grading</div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-orange-600">{submissions.length}</span>
            <Clock className="text-orange-100" size={40} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Engagement Score</div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-green-600">88%</span>
            <BarChart3 className="text-green-100" size={40} />
          </div>
        </div>
      </div>

      {/* Pending Submissions Queue */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-700 flex items-center">
            <FileCheck size={18} className="mr-2 text-blue-600" />
            Grading Queue (Action Required)
          </h3>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">PENDING EVALUATION</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Student</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Assignment</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Course</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest">Date</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-[10px] tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        {sub.student?.name?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{sub.student?.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{sub.student?.reg_no}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{sub.assignment?.title}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {sub.assignment?.course_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setGradingSub(sub)}
                      className="text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Grade Now
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 italic">
                    All caught up! No pending submissions to grade.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {gradingSub && (
        <GradingModal 
          submission={gradingSub} 
          onClose={() => setGradingSub(null)} 
          onSuccess={() => {
            setGradingSub(null);
            window.location.reload();
          }} 
        />
      )}
    </div>
  );
};

const GradingModal: React.FC<{ submission: any, onClose: () => void, onSuccess: () => void }> = ({ submission, onClose, onSuccess }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGrade = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from('submissions')
      .update({
        marks_obtained: parseInt(marks),
        feedback: feedback,
        status: 'Graded'
      })
      .eq('id', submission.id);
    
    if (!error) onSuccess();
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h3 className="font-bold text-xl">Evaluate Submission</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Student</div>
              <div className="text-gray-800 font-bold">{submission.student?.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Max Marks</div>
              <div className="text-gray-800 font-bold">{submission.assignment?.max_marks}</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ExternalLink size={20} /></div>
              <span className="text-sm font-medium text-blue-700">Student Submission File</span>
            </div>
            <a href={submission.file_url} target="_blank" className="bg-blue-600 text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase shadow-sm">View Work</a>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Assign Marks</label>
              <input 
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-600 font-bold transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Feedback Comments</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Good work, but improve the code structure..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-600 text-sm transition-all"
              />
            </div>
          </div>

          <button 
            disabled={submitting || !marks}
            onClick={handleGrade}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-lg"
          >
            {submitting ? 'Updating Gradebook...' : 'Submit Evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
};
