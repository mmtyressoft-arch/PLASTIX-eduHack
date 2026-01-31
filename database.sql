
-- ... (existing tables: students, attendance, grades, credit_requirements, teachers, courses, etc.)

-- ADDING MOCK STUDENT FOR FAILURE PREDICTION ANALYSIS
INSERT INTO students (reg_no, password, name, email, degree, batch, section, faculty_advisor, dob, gender, nationality, religion, community, caste, address, cgpa, earned_credits, arrears)
VALUES ('9924008006', 'pass123', 'Mithun Nishanthk', 'mithun.n@klu.ac.in', 'B.Tech IT', '2021-2025', 'B', 'Dr. S. Karthik', '2003-05-15', 'MALE', 'INDIAN', 'HINDU', 'BC', 'N/A', '78, North Street, Madurai', 6.5, 92, 2);

-- ENROLL MITHUN IN COURSES
INSERT INTO enrollments (student_id, course_code)
SELECT id, '213INT2313' FROM students WHERE reg_no = '9924008006' UNION ALL
SELECT id, '213INT3304' FROM students WHERE reg_no = '9924008006' UNION ALL
SELECT id, '213INT1309' FROM students WHERE reg_no = '9924008006';

-- LOW ATTENDANCE DATA FOR MITHUN (To trigger failure risk)
INSERT INTO attendance (student_id, course_code, course_name, conducted, attended, onduty, medical_leave, restricted_holiday, percentage)
SELECT id, '213INT2313', 'Mobile Application Development', 40, 25, 0, 0, 0, '62.5' FROM students WHERE reg_no = '9924008006' UNION ALL
SELECT id, '213INT3304', 'Machine Learning', 45, 30, 2, 0, 0, '71.1' FROM students WHERE reg_no = '9924008006' UNION ALL
SELECT id, '213INT1309', 'Information Security', 38, 20, 0, 0, 0, '52.6' FROM students WHERE reg_no = '9924008006';

-- LOW QUIZ SCORES FOR MITHUN
INSERT INTO quiz_attempts (quiz_id, student_id, score)
SELECT q.id, s.id, 35 FROM quizzes q, students s WHERE s.reg_no = '9924008006' AND q.title = 'React Hooks Basics' UNION ALL
SELECT q.id, s.id, 42 FROM quizzes q, students s WHERE s.reg_no = '9924008006' AND q.title = 'ML Fundamentals';

-- FEW ACTIVITY LOGS
INSERT INTO activity_logs (user_id, role, action, course_code, time_spent_seconds)
SELECT id, 'student', 'view_material', '213INT2313', 120 FROM students WHERE reg_no = '9924008006' UNION ALL
SELECT id, 'student', 'attempt_quiz', '213INT3304', 300 FROM students WHERE reg_no = '9924008006';

-- RELEVANT SUBMISSIONS (Late or missing)
INSERT INTO submissions (assignment_id, student_id, file_url, status, marks_obtained, feedback)
SELECT a.id, s.id, 'https://drive.google.com/test', 'Graded', 40, 'Poor attempt, needs more details.' 
FROM assignments a, students s WHERE s.reg_no = '9924008006' AND a.title = 'Build a Login Form';
