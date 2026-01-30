
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, FileText, CheckCircle2, 
  Clock, ArrowRight, Loader2, PlayCircle, Download, Send, HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course, LMSMaterial, Assignment, Submission, Quiz } from '../types';

export const LMSDashboard: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('courses(*)')
        .eq('student_id', studentId);
      
      if (!error && data) {
        setCourses(data.map((item: any) => item.courses));
      }
      setLoading(false);
    };
    fetchCourses();
  }, [studentId]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (selectedCourse) {
    return <CourseView course={selectedCourse} onBack={() => setSelectedCourse(null)} studentId={studentId} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div 
            key={course.course_code}
            onClick={() => setSelectedCourse(course)}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <BookOpen size={100} />
              </div>
              <div className="text-white">
                <div className="text-[10px] font-bold uppercase opacity-80 tracking-widest">{course.course_code}</div>
                <div className="text-lg font-bold line-clamp-2 mt-1">{course.course_name}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 font-medium italic">Sem {course.semester} • {course.department}</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 font-bold rounded">ENROLLED</span>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                Go to Course <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseView: React.FC<{ course: Course, onBack: () => void, studentId: string }> = ({ course, onBack, studentId }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'assignments' | 'quizzes'>('materials');
  const [materials, setMaterials] = useState<LMSMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [matRes, asgnRes, quizRes] = await Promise.all([
        supabase.from('materials').select('*').eq('course_code', course.course_code).order('week_number'),
        supabase.from('assignments').select('*').eq('course_code', course.course_code),
        supabase.from('quizzes').select('*').eq('course_code', course.course_code)
      ]);
      setMaterials(matRes.data || []);
      setAssignments(asgnRes.data || []);
      setQuizzes(quizRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [course.course_code]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-blue-600 text-sm flex items-center mb-2 hover:underline">
            <ArrowRight size={14} className="rotate-180 mr-1" /> Back to My Courses
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{course.course_name}</h2>
          <p className="text-sm text-gray-500">{course.course_code} | Semester {course.semester}</p>
        </div>
        <div className="flex bg-white border border-gray-200 p-1 rounded">
          {['materials', 'assignments', 'quizzes'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === t ? 'bg-blue-600 text-white rounded' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : activeTab === 'materials' ? (
          <div className="space-y-8">
            {[1, 2, 3, 4].map(week => {
              const weekMats = materials.filter(m => m.week_number === week);
              if (weekMats.length === 0) return null;
              return (
                <div key={week}>
                  <h3 className="text-sm font-bold text-gray-700 bg-gray-50 p-2 border-l-4 border-blue-600 mb-4 uppercase tracking-wider">
                    Week {week}: Learning Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weekMats.map(mat => (
                      <a 
                        key={mat.id} 
                        href={mat.url} 
                        target="_blank" 
                        className="flex items-center p-4 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className={`p-3 rounded mr-4 ${
                          mat.type === 'PDF' ? 'bg-red-50 text-red-500' : 
                          mat.type === 'Video' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-500'
                        }`}>
                          {mat.type === 'PDF' ? <FileText size={20} /> : <PlayCircle size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-800">{mat.title}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-medium">{mat.type} Resources</div>
                        </div>
                        <Download size={16} className="text-gray-300 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'assignments' ? (
          <div className="space-y-4">
            {assignments.map(asgn => (
              <div key={asgn.id} className="border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded mr-4">
                    <Send size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{asgn.title}</div>
                    <div className="text-[11px] text-gray-500 flex items-center mt-1">
                      <Clock size={12} className="mr-1" /> Deadline: {new Date(asgn.deadline).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white text-[11px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-blue-700 transition-colors">
                  Submit Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-blue-50/50 border border-blue-100 p-6 rounded-lg text-center">
                <HelpCircle className="mx-auto text-blue-500 mb-4" size={40} />
                <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                <div className="flex justify-center space-x-4 mt-2 mb-6">
                  <span className="text-xs text-gray-500 font-bold">{quiz.total_questions} Questions</span>
                  <span className="text-xs text-gray-500 font-bold">{quiz.time_limit_minutes} Mins</span>
                </div>
                <button className="w-full bg-blue-600 text-white font-bold py-3 text-sm uppercase tracking-widest hover:bg-blue-700 transition-shadow">
                  Attempt Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
