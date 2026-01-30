
import React from 'react';

export const PRIMARY_COLOR = '#2f7dbd';
export const SIDEBAR_BG = '#263238';

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'exam-papers', label: 'Exam Papers', icon: 'FileText', isNew: true },
  { id: 'revaluation', label: 'Revaluation', icon: 'FileCheck' },
  { 
    id: 'semester', 
    label: 'Semester', 
    icon: 'Settings',
    subItems: [
      { id: 'attendance', label: 'Attendance Details', icon: 'Circle' },
      { id: 'marks', label: 'Mark Details', icon: 'Circle' },
      { id: 'registration', label: 'Registration', icon: 'Circle' },
    ]
  },
  { id: 'grade-forecasting', label: 'Grade Forecasting', icon: 'TrendingUp', isNew: true },
  { id: 'hall-ticket', label: 'Hall Ticket', icon: 'CheckSquare', isNew: true },
  { id: 'course-reg', label: 'Course Registration', icon: 'Bell' },
  { id: 'course-withdraw', label: 'Coursewithdrawal', icon: 'Bell' },
  { id: 'arrear-reg', label: 'Arrear Registration', icon: 'CheckSquare', isNew: true },
  { id: 'backlog-reg', label: 'Backlog Registration', icon: 'Bell' },
  { id: 'grade', label: 'Grade', icon: 'Flag' },
  { id: 'seating', label: 'Seating & Time Table', icon: 'Calendar' },
  { id: 'industrial', label: 'Industrial Training TPO', icon: 'Briefcase' },
  { id: 'online-courses', label: 'Online Courses', icon: 'Monitor' },
  { id: 'one-credit', label: 'One Credit', icon: 'File' },
  { id: 'online-it', label: 'Online/Intern/IT Courses', icon: 'ExternalLink' },
  { id: 'non-cgpa', label: 'NonCGPA', icon: 'Layout' },
  { id: 'fees', label: 'Fees', icon: 'CreditCard' },
  { id: 'circulars', label: 'Circulars', icon: 'FileText' },
  { id: 'koha', label: 'Koha Automation', icon: 'Home' },
  { id: 'hostel', label: 'Hostel Booking', icon: 'Home' },
  { id: 'transport', label: 'Transport Booking', icon: 'Truck' },
  { id: 'password', label: 'Change Password', icon: 'Lock' },
  { id: 'calendar', label: 'Academic Calendar', icon: 'CalendarDays' },
  { id: 'logout', label: 'Logout', icon: 'LogOut' },
];

export const ATTENDANCE_DATA = [
  { id: '1', code: '215EXS2201', name: 'Design-Build', conducted: 17, attended: 16, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '94.0' },
  { id: '2', code: '213INT3304', name: 'Machine Learning', conducted: 27, attended: 26, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '96.0' },
  { id: '3', code: '213INT2313', name: 'Mobile Application Development', conducted: 28, attended: 23, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '82.0' },
  { id: '4', code: '213INT2303', name: 'Programming with Open Source Software', conducted: 28, attended: 23, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '82.0' },
  { id: '5', code: '213INT1309', name: 'Information Security', conducted: 76, attended: 60, onduty: 4, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '84.0' },
  { id: '6', code: '212INT2305', name: 'Embedded System and Technology', conducted: 23, attended: 18, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '78.0' },
  { id: '7', code: '212INT2304', name: 'Object Oriented Programming using Java', conducted: 75, attended: 61, onduty: 4, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '87.0' },
  { id: '8', code: '212INT2303', name: 'Data Structures and Algorithms', conducted: 81, attended: 66, onduty: 4, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '86.0' },
  { id: '9', code: '212INT2302', name: 'Operating System Concepts', conducted: 27, attended: 24, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '89.0' },
  { id: '10', code: '212INT2101', name: 'Discrete Mathematics', conducted: 23, attended: 19, onduty: 0, medicalLeave: 0, restrictedHoliday: 0, extraHours: 0, percentage: '83.0' },
];

export const GRADE_DATA = [
  { semester: 1, code: '211ENG1301', name: 'English for Engineers', credits: 3.0, points: 8, grade: 'C', category: 'FC', examMonth: 'Nov/Dec 2024' },
  { semester: 1, code: '211MAT1301', name: 'Linear Algebra and Calculus', credits: 4.0, points: 9, grade: 'B', category: 'FC', examMonth: 'Nov/Dec 2024' },
  { semester: 1, code: '211MEC1201', name: 'Introduction to Engineering Visualization', credits: 2.0, points: 9, grade: 'A', category: 'FC', examMonth: 'Nov/Dec 2024' },
  { semester: 1, code: '211PHY1301', name: 'Physics', credits: 3.0, points: 8, grade: 'D', category: 'FC', examMonth: 'Nov/Dec 2024' },
  { semester: 2, code: '211CHY1301', name: 'Chemistry', credits: 3.0, points: 9, grade: 'B', category: 'FC', examMonth: 'Apr/May 2025' },
  { semester: 2, code: '211CSE1302', name: 'Python Programming', credits: 3.0, points: 8, grade: 'B', category: 'FC', examMonth: 'Apr/May 2025' },
  { semester: 2, code: '211EEE1301', name: 'Basic Electrical and Electronics Engineering', credits: 4.0, points: 9, grade: 'B', category: 'FC', examMonth: 'Apr/May 2025' },
  { semester: 2, code: '211MAT1303', name: 'Multiple Integration, Ordinary Differential Equations and Complex Variable', credits: 4.0, points: 8, grade: 'C', category: 'FC', examMonth: 'Apr/May 2025' },
];

export const CREDIT_REQUIREMENTS = [
  { category: 'Experiential Core(EC)', minCredits: 18.0, studied: 0, earned: 0, toBeEarned: 16 },
  { category: 'Experiential Elective(EE)', minCredits: 8.0, studied: 0, earned: 0, toBeEarned: 8 },
  { category: 'Foundation Core(FC)', minCredits: 44.0, studied: 42.0, earned: 42.0, toBeEarned: 2 },
  { category: 'Honours(HO)', minCredits: 20.0, studied: 0, earned: 0, toBeEarned: 20 },
  { category: 'Minors(MI)', minCredits: 20.0, studied: 0, earned: 0, toBeEarned: 20 },
  { category: 'Program Core(PC)', minCredits: 52.0, studied: 19.0, earned: 19.0, toBeEarned: 33 },
  { category: 'Program Elective Courses(PE)', minCredits: 24.0, studied: 4.0, earned: 4.0, toBeEarned: 20 },
  { category: 'University Elective Courses(UE)', minCredits: 18.0, studied: 0, earned: 0, toBeEarned: 18 },
];
