
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  reg_no?: string;
  staff_id?: string;
  department?: string;
  designation?: string;
}

export interface Student extends UserProfile {
  reg_no: string;
  aadhar: string;
  degree: string;
  batch: string;
  section: string;
  faculty_advisor: string;
  dob: string;
  gender: string;
  nationality: string;
  religion: string;
  community: string;
  caste: string;
  address: string;
  cgpa: number;
  earned_credits: number;
  arrears: number;
}

export interface Teacher extends UserProfile {
  staff_id: string;
  department: string;
  designation: string;
}

export interface Course {
  course_code: string;
  course_name: string;
  semester: number;
  department: string;
  syllabus_url?: string;
  description?: string;
}

export interface LMSMaterial {
  id: string;
  course_code: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link';
  url: string;
  week_number: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_code: string;
  title: string;
  description: string;
  deadline: string;
  max_marks: number;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  submitted_at: string;
  marks_obtained?: number;
  feedback?: string;
  status: 'Pending' | 'Graded';
}

export interface Quiz {
  id: string;
  course_code: string;
  title: string;
  time_limit_minutes: number;
  total_questions: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_option: number;
}

// Added missing fields used in AttendanceDetails.tsx
export interface AttendanceRecord {
  id: string;
  course_code: string;
  course_name: string;
  conducted: number;
  attended: number;
  onduty: number;
  medical_leave: number;
  restricted_holiday: number;
  extra_hours?: number;
  percentage?: string;
}

// Added DailyAttendance interface to fix import error in AttendanceDetails.tsx
export interface DailyAttendance {
  id: string;
  student_id: string;
  course_code: string;
  date: string;
  slot: string;
  status: string;
}

// Added missing fields used in GradeDetails.tsx
export interface GradeRecord {
  id: string;
  semester: number;
  course_code: string;
  course_name: string;
  credits: number;
  grade_points: number;
  grade: string;
  category: string;
  exam_month_year: string;
}

// Added CreditRequirement interface to fix import error in GradeDetails.tsx
export interface CreditRequirement {
  id: string;
  student_id: string;
  category: string;
  min_credits: number;
  studied: number;
  earned: number;
  to_be_earned: number;
}
