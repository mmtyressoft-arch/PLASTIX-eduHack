
-- Clean up existing tables
DROP TABLE IF EXISTS daily_attendance;
DROP TABLE IF EXISTS credit_requirements;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS students;

-- 1. Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reg_no VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    aadhar VARCHAR(20),
    degree VARCHAR(100),
    batch VARCHAR(10),
    section VARCHAR(5),
    faculty_advisor VARCHAR(255),
    dob DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    religion VARCHAR(50),
    community VARCHAR(50),
    caste VARCHAR(50),
    address TEXT,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    earned_credits DECIMAL(5,2) DEFAULT 0.00,
    arrears INT DEFAULT 0
);

-- 2. Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(20),
    course_name VARCHAR(100),
    conducted INT DEFAULT 0,
    attended INT DEFAULT 0,
    onduty INT DEFAULT 0,
    medical_leave INT DEFAULT 0,
    restricted_holiday INT DEFAULT 0,
    extra_hours INT DEFAULT 0,
    percentage DECIMAL(5,2)
);

-- 3. Daily Attendance Table
CREATE TABLE daily_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(20),
    date DATE NOT NULL,
    slot VARCHAR(20),
    status VARCHAR(10) -- 'Present', 'Absent', 'OD'
);

-- 4. Grades Table
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    semester INT,
    course_code VARCHAR(20),
    course_name VARCHAR(100),
    credits DECIMAL(3,1),
    grade_points INT,
    grade VARCHAR(2),
    category VARCHAR(20),
    exam_month_year VARCHAR(50)
);

-- 5. Credit Requirements Table
CREATE TABLE credit_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    category VARCHAR(50),
    min_credits DECIMAL(4,1),
    studied DECIMAL(4,1),
    earned DECIMAL(4,1),
    to_be_earned DECIMAL(4,1)
);

-- 6. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INSERT STUDENT: ADHAVAN
INSERT INTO students (reg_no, password, name, degree, batch, section, faculty_advisor, dob, gender, address, aadhar, cgpa, earned_credits, email, nationality, religion, community, caste)
VALUES ('9924008001', 'Pass123', 'ADHAVAN A', 'B.Tech. / IT', '2024', 'A', 'Ms. J. NULYN PUNITHA MARKAVATHI', '2007-05-19', 'Male', '59/4, KURINJI NAGAR, ALANGUDI', '921396359802', 8.12, 65.0, 'adhavan@klu.ac.in', 'INDIAN', 'HINDU', 'BC', 'VEERAKUDI VELLALAR');

-- INSERT 20 GRADES FOR ADHAVAN
INSERT INTO grades (student_id, semester, course_code, course_name, credits, grade_points, grade, category, exam_month_year)
SELECT id, 1, '211ENG1301', 'Communicative English', 3.0, 9, 'A', 'FC', 'Nov 2024' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 1, '211MAT1301', 'Calculus and Linear Algebra', 4.0, 10, 'S', 'FC', 'Nov 2024' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 1, '211PHY1301', 'Engineering Physics', 3.0, 8, 'B', 'FC', 'Nov 2024' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 1, '211CSE1301', 'Python Programming', 3.0, 9, 'A', 'FC', 'Nov 2024' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 1, '211MEC1201', 'Engineering Graphics', 2.0, 10, 'S', 'FC', 'Nov 2024' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 2, '211CHY1301', 'Engineering Chemistry', 3.0, 9, 'A', 'FC', 'May 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 2, '211MAT1302', 'Complex Variables', 4.0, 8, 'B', 'FC', 'May 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 2, '211CSE1302', 'Data Structures', 3.0, 10, 'S', 'PC', 'May 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 2, '211EEE1301', 'Basic Electrical Engineering', 3.0, 7, 'C', 'FC', 'May 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 2, '211ENG1302', 'Technical English', 2.0, 9, 'A', 'FC', 'May 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 3, '213INT1301', 'Object Oriented Programming', 3.0, 10, 'S', 'PC', 'Nov 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 3, '213INT1302', 'Computer Architecture', 3.0, 8, 'B', 'PC', 'Nov 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 3, '213INT1303', 'Database Management', 4.0, 9, 'A', 'PC', 'Nov 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 3, '213INT1304', 'Discrete Mathematics', 4.0, 7, 'C', 'PC', 'Nov 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 3, '213INT1305', 'Operating Systems', 3.0, 9, 'A', 'PC', 'Nov 2025' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 4, '213INT2301', 'Design of Algorithms', 4.0, 10, 'S', 'PC', 'May 2026' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 4, '213INT2302', 'Java Programming', 3.0, 9, 'A', 'PC', 'May 2026' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 4, '213INT2303', 'Software Engineering', 3.0, 8, 'B', 'PC', 'May 2026' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 4, '213INT2304', 'Computer Networks', 3.0, 9, 'A', 'PC', 'May 2026' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, 4, '213INT2305', 'Automata Theory', 4.0, 7, 'C', 'PC', 'May 2026' FROM students WHERE reg_no = '9924008001';

-- INSERT 7 ATTENDANCE RECORDS FOR ADHAVAN
INSERT INTO attendance (student_id, course_code, course_name, conducted, attended, percentage)
SELECT id, '213INT2313', 'Mobile Application Development', 28, 26, 92.86 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT3304', 'Machine Learning', 30, 28, 93.33 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '215EXS2201', 'Design-Build', 15, 15, 100.00 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT2303', 'Open Source Software', 25, 20, 80.00 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '212INT2305', 'Embedded Systems', 20, 18, 90.00 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT1309', 'Information Security', 35, 30, 85.71 FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '212INT2302', 'Operating Systems', 24, 22, 91.67 FROM students WHERE reg_no = '9924008001';

-- INSERT DAILY LOGS (WITH PROPER DATE CASTING)
INSERT INTO daily_attendance (student_id, course_code, date, slot, status)
SELECT id, '213INT2313', '2024-06-01'::DATE, 'Slot 1', 'Present' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT2313', '2024-06-01'::DATE, 'Slot 2', 'Present' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT2313', '2024-06-02'::DATE, 'Slot 1', 'Absent' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT2313', '2024-06-03'::DATE, 'Slot 3', 'Present' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT3304', '2024-06-01'::DATE, 'Slot 4', 'Present' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT3304', '2024-06-02'::DATE, 'Slot 2', 'Present' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT3304', '2024-06-03'::DATE, 'Slot 1', 'OD' FROM students WHERE reg_no = '9924008001';

-- CREDIT REQS FOR ADHAVAN
INSERT INTO credit_requirements (student_id, category, min_credits, studied, earned, to_be_earned)
SELECT id, 'Foundation Core(FC)', 44.0, 42.0, 42.0, 2.0 FROM students WHERE reg_no = '9924008001';

-- OTHER STUDENTS
INSERT INTO students (reg_no, password, name, degree, batch, section, faculty_advisor, dob, gender, address, aadhar, cgpa, earned_credits, email, nationality, religion, community, caste)
VALUES 
('9924008002', 'Pass123', 'BHARATH B', 'B.Tech. / IT', '2024', 'A', 'Ms. J. NULYN PUNITHA MARKAVATHI', '2007-06-12', 'Male', '12/A, MAIN ROAD, MADURAI', '123456789012', 7.80, 62.0, 'bharath@klu.ac.in', 'INDIAN', 'HINDU', 'BC', 'NAIDU'),
('9924008003', 'Pass123', 'CHANDRU C', 'B.Tech. / IT', '2024', 'A', 'Ms. J. NULYN PUNITHA MARKAVATHI', '2007-07-25', 'Male', '45, NORTH ST, TRICHY', '223456789012', 8.45, 68.0, 'chandru@klu.ac.in', 'INDIAN', 'HINDU', 'BC', 'PILLAI'),
('9924008004', 'Pass123', 'DIVYA D', 'B.Tech. / IT', '2024', 'B', 'Dr. S. RAMESH', '2007-08-15', 'Female', '7, SOUTH GATE, CHENNAI', '323456789012', 9.10, 72.0, 'divya@klu.ac.in', 'INDIAN', 'HINDU', 'FC', 'BRAHMIN'),
('9924008005', 'Pass123', 'EZHIL E', 'B.Tech. / IT', '2024', 'B', 'Dr. S. RAMESH', '2007-09-01', 'Male', '88, EAST STREET, SALEM', '423456789012', 7.20, 58.0, 'ezhil@klu.ac.in', 'INDIAN', 'CHRISTIAN', 'BC', 'NADAR');
