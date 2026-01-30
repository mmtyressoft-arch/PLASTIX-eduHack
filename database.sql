
-- ... (existing tables: students, attendance, grades, credit_requirements)

-- NEW LMS TABLES
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(100),
    designation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    semester INT,
    department VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teaching_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    title VARCHAR(200),
    type VARCHAR(20), -- 'PDF', 'Video', 'Link'
    url TEXT,
    week_number INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    title VARCHAR(200),
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    max_marks INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    marks_obtained INT,
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    title VARCHAR(200),
    time_limit_minutes INT DEFAULT 15,
    total_questions INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT,
    options JSONB,
    correct_option INT
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    score INT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    role VARCHAR(10),
    action VARCHAR(100),
    course_code VARCHAR(20),
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MOCK DATA
INSERT INTO teachers (staff_id, password, name, email, department, designation)
VALUES ('T101', 'Pass123', 'Ms. J. NULYN PUNITHA MARKAVATHI', 'nulyn@klu.ac.in', 'IT', 'Assistant Professor');

INSERT INTO courses (course_code, course_name, semester, department, description)
VALUES 
('213INT2313', 'Mobile Application Development', 4, 'IT', 'Learning Android & iOS using React Native.'),
('213INT3304', 'Machine Learning', 4, 'IT', 'Modern ML algorithms and applications.'),
('213INT1309', 'Information Security', 4, 'IT', 'Network security and ethical hacking.');

INSERT INTO teaching_assignments (teacher_id, course_code)
SELECT id, '213INT2313' FROM teachers WHERE staff_id = 'T101' UNION ALL
SELECT id, '213INT3304' FROM teachers WHERE staff_id = 'T101';

INSERT INTO enrollments (student_id, course_code)
SELECT id, '213INT2313' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT3304' FROM students WHERE reg_no = '9924008001' UNION ALL
SELECT id, '213INT1309' FROM students WHERE reg_no = '9924008001';

-- COMPREHENSIVE MATERIALS (YouTube for all courses)
INSERT INTO materials (course_code, title, type, url, week_number)
VALUES 
('213INT2313', 'React Native Installation', 'Video', 'https://www.youtube.com/watch?v=gvkqT_Uoahw', 1),
('213INT2313', 'Flexbox Layout Tutorial', 'Video', 'https://www.youtube.com/watch?v=k3Y04u2S_S8', 2),
('213INT2313', 'Component Lifecycle PDF', 'PDF', 'https://example.com/lifecycle.pdf', 1),
('213INT3304', 'Intro to Neural Networks', 'Video', 'https://www.youtube.com/watch?v=aircAruvnKk', 1),
('213INT3304', 'Linear Regression Explained', 'Video', 'https://www.youtube.com/watch?v=PaFPbb66DxQ', 2),
('213INT1309', 'Information Security Basics', 'Video', 'https://www.youtube.com/watch?v=bPVaOlJ6ln0', 1),
('213INT1309', 'Cryptography 101', 'Video', 'https://www.youtube.com/watch?v=S9JGmA5_unY', 2);

-- ASSIGNMENTS FOR ALL SUBJECTS
INSERT INTO assignments (course_code, title, description, deadline, max_marks)
VALUES 
('213INT2313', 'Build a Login Form', 'Use Flexbox and TextInput components.', NOW() + INTERVAL '7 days', 100),
('213INT3304', 'Linear Regression Lab', 'Complete the Python notebook provided.', NOW() + INTERVAL '3 days', 50),
('213INT1309', 'Encryption Research', 'Explain RSA algorithm in 2 pages.', NOW() + INTERVAL '10 days', 100);

-- QUIZZES FOR ALL SUBJECTS
INSERT INTO quizzes (course_code, title, time_limit_minutes, total_questions)
VALUES 
('213INT2313', 'React Hooks Basics', 10, 2),
('213INT3304', 'ML Fundamentals', 15, 2),
('213INT1309', 'Security Quiz 1', 10, 1);

-- QUESTIONS
INSERT INTO quiz_questions (quiz_id, question, options, correct_option)
SELECT id, 'Which hook is used for side effects?', '["useState", "useEffect", "useMemo", "useRef"]'::JSONB, 1 FROM quizzes WHERE title = 'React Hooks Basics' UNION ALL
SELECT id, 'What is supervised learning?', '["Labeled data", "Unlabeled data", "No data", "Random data"]'::JSONB, 0 FROM quizzes WHERE title = 'ML Fundamentals' UNION ALL
SELECT id, 'What is the primary goal of CIA triad?', '["Confidentiality", "Invisibility", "Accessibility", "Control"]'::JSONB, 0 FROM quizzes WHERE title = 'Security Quiz 1';
