
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, Video, FileText, CheckCircle2, 
  Clock, ArrowRight, Loader2, PlayCircle, Download, Send, HelpCircle,
  X, AlertCircle, Trophy, ChevronRight, ChevronLeft, Youtube, Target
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course, LMSMaterial, Assignment, Submission, Quiz, QuizQuestion } from '../types';

// Helper to log activity
const logActivity = async (userId: string, action: string, courseCode: string, seconds: number = 0) => {
  await supabase.from('activity_logs').insert({
    user_id: userId,
    role: 'student',
    action,
    course_code: courseCode,
    time_spent_seconds: seconds
  });
};

export const LMSDashboard: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Generate a consistent "Random" LMS score based on studentId hash
  const lmsScore = useMemo(() => {
    const seed = studentId.charCodeAt(studentId.length - 1) + studentId.charCodeAt(0);
    const randomValue = (seed % 25) / 10 + 7.0; // Results in 7.0 to 9.5
    return randomValue.toFixed(1);
  }, [studentId]);

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
      {/* LMS Header Stats */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Learning Management System</h2>
            <p className="text-sm text-gray-500">Access your digital classroom and materials</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">LMS Performance</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl font-black text-blue-600">{lmsScore}</span>
              <span className="text-xs font-bold text-gray-400">/ 10</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Courses</div>
            <div className="text-3xl font-black text-gray-800">{courses.length}</div>
          </div>
        </div>
      </div>

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
              <div className="text-white relative z-10">
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
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [matRes, asgnRes, quizRes, subRes] = await Promise.all([
        supabase.from('materials').select('*').eq('course_code', course.course_code).order('week_number'),
        supabase.from('assignments').select('*').eq('course_code', course.course_code),
        supabase.from('quizzes').select('*').eq('course_code', course.course_code),
        supabase.from('submissions').select('*').eq('student_id', studentId)
      ]);
      setMaterials(matRes.data || []);
      setAssignments(asgnRes.data || []);
      setQuizzes(quizRes.data || []);
      
      const subMap: Record<string, Submission> = {};
      (subRes.data || []).forEach((s: any) => subMap[s.assignment_id] = s);
      setSubmissions(subMap);
      
      setLoading(false);
      logActivity(studentId, 'view_course', course.course_code);
    };
    fetchData();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      logActivity(studentId, 'exit_course', course.course_code, timeSpent);
    };
  }, [course.course_code]);

  if (activeQuiz) {
    return <QuizEngine quiz={activeQuiz} studentId={studentId} onFinish={() => setActiveQuiz(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-blue-600 text-sm flex items-center mb-2 hover:underline">
            <ArrowRight size={14} className="rotate-180 mr-1" /> Back to My Courses
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{course.course_name}</h2>
          <p className="text-sm text-gray-500">{course.course_code} | Semester {course.semester}</p>
        </div>
        <div className="flex bg-white border border-gray-200 p-1 rounded shadow-sm">
          {['materials', 'assignments', 'quizzes'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === t ? 'bg-blue-600 text-white rounded shadow-sm' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm min-h-[500px] rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : activeTab === 'materials' ? (
          <div className="p-6 space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(week => {
              const weekMats = materials.filter(m => m.week_number === week);
              if (weekMats.length === 0) return null;
              return (
                <div key={week}>
                  <h3 className="text-sm font-bold text-gray-700 bg-gray-50 p-3 border-l-4 border-blue-600 mb-4 uppercase tracking-wider flex items-center">
                    <BookOpen size={16} className="mr-2 text-blue-600" />
                    Week {week}: Learning Resources
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {weekMats.map(mat => {
                      const isYoutube = mat.url.includes('youtube.com') || mat.url.includes('youtu.be');
                      const videoId = isYoutube ? (mat.url.split('v=')[1]?.split('&')[0] || mat.url.split('/').pop()) : null;

                      return (
                        <div key={mat.id} className="border border-gray-100 p-4 hover:border-blue-200 hover:bg-blue-50/10 transition-all rounded-lg group">
                          <div className="flex items-center mb-3">
                            <div className={`p-3 rounded-lg mr-4 ${
                              mat.type === 'PDF' ? 'bg-red-50 text-red-500' : 
                              mat.type === 'Video' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                            }`}>
                              {mat.type === 'PDF' ? <FileText size={20} /> : mat.type === 'Video' ? <Video size={20} /> : <BookOpen size={20} />}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-800">{mat.title}</div>
                              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{mat.type} Resource</div>
                            </div>
                            <a href={mat.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Download size={18} />
                            </a>
                          </div>
                          
                          {mat.type === 'Video' && isYoutube && videoId && (
                            <div className="mt-3 aspect-video bg-black rounded-lg overflow-hidden shadow-inner relative group/player">
                              <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={mat.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {materials.length === 0 && <div className="text-center py-20 text-gray-400 italic">No materials uploaded yet.</div>}
          </div>
        ) : activeTab === 'assignments' ? (
          <div className="p-6 space-y-4">
            {assignments.map(asgn => {
              const sub = submissions[asgn.id];
              return (
                <div key={asgn.id} className="border border-gray-100 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-all">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-orange-50 text-orange-600 p-4 rounded-xl mr-4 shadow-sm">
                      <Send size={24} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-800">{asgn.title}</div>
                      <div className="text-[11px] text-gray-500 flex items-center mt-1 font-medium">
                        <Clock size={12} className="mr-1" /> Deadline: {new Date(asgn.deadline).toLocaleString()}
                      </div>
                      <div className="mt-2 text-xs text-gray-600 line-clamp-1">{asgn.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    {sub ? (
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'Graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sub.status === 'Graded' ? `GRADED: ${sub.marks_obtained}/${asgn.max_marks}` : 'SUBMITTED'}
                        </span>
                        {sub.feedback && <span className="text-[10px] text-gray-400 mt-1 italic max-w-[150px] truncate">"{sub.feedback}"</span>}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveAssignment(asgn)}
                        className="w-full md:w-auto bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded shadow-sm hover:bg-blue-700 transition-all uppercase tracking-widest"
                      >
                        Submit Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {assignments.length === 0 && <div className="text-center py-20 text-gray-400 italic">No assignments posted.</div>}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white border border-gray-200 p-6 rounded-xl text-center shadow-sm hover:border-blue-300 transition-all">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                <div className="flex justify-center space-x-4 mt-3 mb-6">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                    {quiz.total_questions} Questions
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                    {quiz.time_limit_minutes} Mins
                  </div>
                </div>
                <button 
                  onClick={() => setActiveQuiz(quiz)}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-blue-700 transition-shadow shadow-md"
                >
                  Attempt Quiz
                </button>
              </div>
            ))}
            {quizzes.length === 0 && <div className="col-span-full text-center py-20 text-gray-400 italic">No online tests available.</div>}
          </div>
        )}
      </div>

      {activeAssignment && (
        <AssignmentModal 
          assignment={activeAssignment} 
          studentId={studentId} 
          onClose={() => setActiveAssignment(null)} 
          onSuccess={() => {
            setActiveAssignment(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

// --- Assignment Submission Modal ---
const AssignmentModal: React.FC<{ assignment: Assignment, studentId: string, onClose: () => void, onSuccess: () => void }> = ({ assignment, studentId, onClose, onSuccess }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('submissions').insert({
      assignment_id: assignment.id,
      student_id: studentId,
      file_url: fileUrl,
      status: 'Pending'
    });
    if (!error) onSuccess();
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-lg">Submit Assignment</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Course Assignment</div>
            <div className="text-gray-800 font-bold">{assignment.title}</div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Submission Link (Google Drive / GitHub)</label>
            <input 
              required
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-blue-600 text-sm transition-all"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
            <AlertCircle size={18} className="text-blue-600 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              By submitting, you certify that this work is original and complies with the university's academic integrity policy.
            </p>
          </div>
          <button 
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-md"
          >
            {submitting ? 'Processing Submission...' : 'Upload Work'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Fully Functional Quiz Engine ---
const QuizEngine: React.FC<{ quiz: Quiz, studentId: string, onFinish: () => void }> = ({ quiz, studentId, onFinish }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id);
      setQuestions(data || []);
      setLoading(false);
    };
    fetchQuestions();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.id]);

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) correctCount++;
    });
    const finalScore = Math.round((correctCount / (questions.length || 1)) * 100);
    setScore(finalScore);
    setIsFinished(true);

    await supabase.from('quiz_attempts').insert({
      quiz_id: quiz.id,
      student_id: studentId,
      score: finalScore
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white p-10 rounded-2xl shadow-2xl text-center border border-gray-100 animate-in slide-in-from-bottom-10">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Test Completed!</h2>
        <div className="text-6xl font-black text-blue-600 my-8">{score}%</div>
        <p className="text-gray-500 mb-8 font-medium">Your score has been recorded in the database for faculty review.</p>
        <button 
          onClick={onFinish}
          className="bg-blue-600 text-white font-bold px-10 py-3 rounded-xl uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all"
        >
          Close Result
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 fixed inset-0 z-[200] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="font-bold text-gray-800">{quiz.title}</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Time Remaining</span>
            <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-widest shadow-sm hover:bg-blue-700"
          >
            Finish Test
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8 mt-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
            {q?.question}
          </h2>
          <div className="space-y-4">
            {q?.options.map((option, idx) => (
              <label 
                key={idx}
                className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  answers[q.id] === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <input 
                  type="radio" 
                  name="quiz-option" 
                  className="hidden" 
                  onChange={() => setAnswers({...answers, [q.id]: idx})}
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  answers[q.id] === idx ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {answers[q.id] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-base font-medium ${answers[q.id] === idx ? 'text-blue-800' : 'text-gray-700'}`}>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="flex items-center text-gray-500 font-bold hover:text-blue-600 disabled:opacity-30 transition-colors px-4 py-2"
          >
            <ChevronLeft className="mr-2" size={20} /> Previous
          </button>
          <div className="flex space-x-2">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex ? 'bg-blue-600 scale-125' : answers[questions[idx].id] !== undefined ? 'bg-green-400' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
          <button 
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="flex items-center text-gray-500 font-bold hover:text-blue-600 disabled:opacity-30 transition-colors px-4 py-2"
          >
            Next <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
