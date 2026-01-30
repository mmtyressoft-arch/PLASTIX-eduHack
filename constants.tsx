
export const PRIMARY_COLOR = '#2f7dbd';
export const SIDEBAR_BG = '#263238';

export const STUDENT_SIDEBAR = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { 
    id: 'sis', 
    label: 'SIS Modules', 
    icon: 'Settings',
    subItems: [
      { id: 'attendance', label: 'Attendance Details', icon: 'Circle' },
      { id: 'marks', label: 'Mark Details', icon: 'Circle' },
    ]
  },
  { 
    id: 'lms', 
    label: 'LMS Application', 
    icon: 'Monitor',
    subItems: [
      { id: 'lms-dashboard', label: 'My Courses', icon: 'Circle' },
      { id: 'assignments', label: 'Assignments', icon: 'Circle' },
      { id: 'quizzes', label: 'Online Tests', icon: 'Circle' },
    ]
  },
  { id: 'ml-forecasting', label: 'ML Analytics', icon: 'BarChart3' },
  { id: 'fees', label: 'Fees', icon: 'CreditCard' },
  { id: 'logout', label: 'Logout', icon: 'LogOut' },
];

export const TEACHER_SIDEBAR = [
  { id: 'teacher-dashboard', label: 'Faculty Dashboard', icon: 'LayoutDashboard' },
  { id: 'my-courses', label: 'Handle Courses', icon: 'Monitor' },
  { id: 'evaluate', label: 'Evaluate Submissions', icon: 'FileCheck' },
  { id: 'logout', label: 'Logout', icon: 'LogOut' },
];
