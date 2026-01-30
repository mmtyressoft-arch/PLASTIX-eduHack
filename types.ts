
export interface Student {
  id: string;
  reg_no: string;
  name: string;
  email: string;
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

export interface AttendanceRecord {
  id: string;
  course_code: string;
  course_name: string;
  conducted: number;
  attended: number;
  onduty: number;
  medical_leave: number;
  restricted_holiday: number;
  extra_hours: number;
  percentage?: string;
}

export interface DailyAttendance {
  id: string;
  date: string;
  slot: string;
  status: 'Present' | 'Absent' | 'OD';
}

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

export interface CreditRequirement {
  id: string;
  category: string;
  min_credits: number;
  studied: number;
  earned: number;
  to_be_earned: number;
}

export interface Notification {
  id: string;
  content: string;
  type: 'general' | 'alert';
  created_at: string;
}

export interface MLPrediction {
  id: string;
  student_id: string;
  predicted_gpa: number;
  risk_level: 'Low' | 'Medium' | 'High';
  performance_trend: 'Improving' | 'Stable' | 'Declining';
  confidence_score: number;
  risk_factors: string[];
  recommendation: string;
  prediction_date: string;
}
