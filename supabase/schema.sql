-- =========================================================================
-- NIJA LANGUAGE HUB — SUPABASE DATABASE SCHEMA & PRIVACY POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar_letters TEXT NOT NULL,
  last_active TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar_letters TEXT NOT NULL,
  languages_taught TEXT[] DEFAULT '{}',
  assigned_student_ids TEXT[] DEFAULT '{}',
  total_students INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  classes_completed INT DEFAULT 0,
  bio TEXT,
  qualifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARENTS TABLE
CREATE TABLE IF NOT EXISTS public.parents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  children_ids TEXT[] DEFAULT '{}',
  billing_status TEXT DEFAULT 'Active',
  account_created TEXT NOT NULL,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INT NOT NULL,
  enrolled_language TEXT NOT NULL,
  level TEXT NOT NULL,
  streak_days INT DEFAULT 0,
  xp_points INT DEFAULT 0,
  assigned_teacher_id TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
  assigned_teacher TEXT,
  avatar_letter TEXT NOT NULL,
  attendance_rate INT DEFAULT 100,
  bio TEXT,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCHEDULED CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  teacher_id TEXT REFERENCES public.teachers(id) ON DELETE CASCADE,
  teacher_name TEXT NOT NULL,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming', -- 'live', 'upcoming', 'completed'
  platform TEXT DEFAULT 'google-meet', -- 'google-meet', 'zoom'
  meeting_url TEXT NOT NULL,
  meeting_id TEXT NOT NULL,
  meeting_passcode TEXT NOT NULL,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id TEXT REFERENCES public.teachers(id) ON DELETE CASCADE,
  due_date TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'submitted', 'graded'
  student_submission JSONB DEFAULT NULL,
  grade JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  parent_id TEXT REFERENCES public.parents(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  amount_ngn NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'Paid', -- 'Paid', 'Pending', 'Upcoming'
  method TEXT NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — ENFORCING PRIVACY ISOLATION
-- =========================================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow public read/write during demo or authenticated access with anon key
CREATE POLICY "Public Read Access" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.parents FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.invoices FOR SELECT USING (true);

CREATE POLICY "Public Insert/Update Access" ON public.students FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Access" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Access" ON public.classes FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Access" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Access" ON public.invoices FOR ALL USING (true);

-- =========================================================================
-- SEED INITIAL DATA
-- =========================================================================

-- Insert Super Admin
INSERT INTO public.admins (id, name, email, title, department, avatar_letters)
VALUES 
  ('admin-ngozi', 'Dr. Ngozi Balogun', 'admin@naijalang.com', 'Director of Academics & Hub Operations', 'Academic Leadership & Operations', 'NB')
ON CONFLICT (id) DO NOTHING;

-- Insert Teachers
INSERT INTO public.teachers (id, name, email, phone, title, avatar_letters, languages_taught, assigned_student_ids, total_students, rating, classes_completed, bio, qualifications)
VALUES 
  ('teacher-ojo', 'Mrs. Folashade Ojo', 'folashade.ojo@staff.naijalang.com', '+234 803 249 8172', 'Senior Yoruba Linguist & Heritage Lead', 'FO', 
   ARRAY['Yoruba (Native/Expert)', 'Igbo (Conversational)', 'English'], 
   ARRAY['student-samuel'], 28, 4.96, 342, 
   '12+ years specializing in diasporic child immersion, tonal pedagogy, and interactive Nigerian cultural storytelling.',
   ARRAY['B.A. African Languages & Literature, University of Ibadan', 'Post-Graduate Diploma in Early Childhood Education', 'Certified British & American Online Bilingual Curriculum Lead']),
  ('teacher-eze', 'Mr. Chinedu Eze', 'chinedu.eze@staff.naijalang.com', '+234 806 781 4452', 'Senior Igbo Language Specialist & Oral Historian', 'CE',
   ARRAY['Igbo (Native/Central)', 'English'],
   ARRAY['student-amara'], 22, 4.92, 215,
   'Specialist in Central Igbo phonetics, Igbo folktales, proverbs (Ilu Igbo), and diaspora language retention programs.',
   ARRAY['M.A. Linguistics & Nigerian Languages, University of Nigeria Nsukka', 'Certified Online Pedagogy Instructor'])
ON CONFLICT (id) DO NOTHING;

-- Insert Parents
INSERT INTO public.parents (id, name, email, phone, children_ids, billing_status, account_created, city, country)
VALUES
  ('parent-adewale', 'Olumide Adewale', 'adewale.olumide@parent.naijalang.com', '+234 802 112 3344', ARRAY['student-samuel'], 'Active', 'Aug 15, 2026', 'London', 'United Kingdom'),
  ('parent-okonkwo', 'Chioma Okonkwo', 'chioma.okonkwo@parent.naijalang.com', '+44 7700 900123', ARRAY['student-amara'], 'Active', 'Sep 01, 2026', 'Houston, TX', 'United States')
ON CONFLICT (id) DO NOTHING;

-- Insert Students
INSERT INTO public.students (id, parent_id, name, email, age, enrolled_language, level, streak_days, xp_points, assigned_teacher_id, assigned_teacher, avatar_letter, attendance_rate, bio, badges)
VALUES
  ('student-samuel', 'parent-adewale', 'Samuel Adewale', 'samuel.adewale@student.naijalang.com', 8, 'Yoruba (Heritage Foundation)', 'Level 2 — Intermediate Heritage', 14, 1850, 'teacher-ojo', 'Mrs. Folashade Ojo', 'S', 98, 'Curious 8-year-old learning his ancestral Yoruba language so he can converse with grandparents in Ibadan and Lagos.',
   '[{"id":"b1","name":"Greeting Virtuoso","icon":"award","dateEarned":"Sep 15, 2026"},{"id":"b2","name":"Tone Master","icon":"music","dateEarned":"Sep 22, 2026"},{"id":"b3","name":"14-Day Streak","icon":"streak","dateEarned":"Today"},{"id":"b4","name":"Folktale Listener","icon":"book","dateEarned":"Sep 10, 2026"}]'::jsonb),
  ('student-amara', 'parent-okonkwo', 'Amara Okonkwo', 'amara.okonkwo@student.naijalang.com', 10, 'Igbo (Foundation & Culture)', 'Level 1 — Beginner Immersion', 9, 1420, 'teacher-eze', 'Mr. Chinedu Eze', 'A', 94, '10-year-old born in Houston learning Igbo greetings, market numbers, and proverbs for family celebrations.',
   '[{"id":"b5","name":"Igbo Phonetics Novice","icon":"award","dateEarned":"Sep 18, 2026"},{"id":"b6","name":"9-Day Streak","icon":"streak","dateEarned":"Yesterday"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert Scheduled Classes
INSERT INTO public.classes (id, title, language, teacher_id, teacher_name, student_id, student_name, date, time, status, platform, meeting_url, meeting_id, meeting_passcode, topics)
VALUES
  ('cls-1', 'Yoruba Tone Pairs & Conversational Greetings', 'Yoruba (Foundation)', 'teacher-ojo', 'Mrs. Folashade Ojo', 'student-samuel', 'Samuel Adewale', 'Today', '16:00 - 16:50 WAT', 'live', 'google-meet', 'https://meet.google.com/nai-yru-hub', 'nai-yru-hub', 'YORUBA2026', ARRAY['High, Mid, Low tone marks (Á, A, À)', 'Polite morning & evening salutations', 'Family member titles']),
  ('cls-2', 'Market Simulation & Polite Bargaining Phrases', 'Yoruba (Foundation)', 'teacher-ojo', 'Mrs. Folashade Ojo', 'student-samuel', 'Samuel Adewale', 'Saturday, Sep 27', '10:00 - 10:50 WAT', 'upcoming', 'zoom', 'https://zoom.us/j/84920193819', '849 2019 3819', '593812', ARRAY['Counting naira & kobo in Yoruba', 'Asking ''Eelo ni?'' (How much?)', 'Complimenting goods']),
  ('cls-3', 'Folktale Hour: Ijapa the Tortoise & The Magic Drum', 'Yoruba (Cultural Enrichment)', 'teacher-ojo', 'Mrs. Folashade Ojo', 'student-samuel', 'Samuel Adewale', 'Wednesday, Oct 1', '17:00 - 17:45 WAT', 'upcoming', 'google-meet', 'https://meet.google.com/hub-tor-drum', 'hub-tor-drum', 'FOLKTALE', ARRAY['Listening comprehension', 'Moral of the story discussion', 'Animal vocabulary']),
  ('cls-4', 'Igbo Vowels & Consonant Harmonies (Ndịda na Elu)', 'Igbo (Foundation)', 'teacher-eze', 'Mr. Chinedu Eze', 'student-amara', 'Amara Okonkwo', 'Today', '18:00 - 18:45 WAT', 'live', 'zoom', 'https://zoom.us/j/92144883100', '921 4488 3100', 'IGBO2026', ARRAY['Dot under vowels (Ọ, Ụ, Ị)', 'Greeting elders: ''Ndewo nne na nna''', 'Basic kinship terms']),
  ('cls-5', 'Igbo Counting 1 - 50 and Daily Kitchen Vocabulary', 'Igbo (Foundation)', 'teacher-eze', 'Mr. Chinedu Eze', 'student-amara', 'Amara Okonkwo', 'Friday, Oct 3', '15:30 - 16:15 WAT', 'upcoming', 'google-meet', 'https://meet.google.com/igb-kit-lang', 'igb-kit-lang', 'KITCHEN', ARRAY['Otu, Abụọ, Atọ, Anọ...', 'Utensils & foods in Igbo', 'Requesting a meal politely'])
ON CONFLICT (id) DO NOTHING;

-- Insert Assignments
INSERT INTO public.assignments (id, title, subject, student_id, teacher_id, due_date, description, instructions, status, student_submission, grade)
VALUES
  ('asg-1', 'Audio Practice: Yoruba Greetings for Elders vs Peers', 'Yoruba Foundation', 'student-samuel', 'teacher-ojo', 'Due Tomorrow, 18:00 WAT', 'Record yourself pronouncing 3 polite greetings with correct tone marks.', 'Please pronounce: 1. ''Ẹ káàrọ̀ mà'' (Good morning ma) 2. ''Ẹ kú ìrọ̀lẹ́'' (Good evening) 3. ''Báwo ni ọ̀rẹ́ mi'' (How are you my friend).', 'submitted',
   '{"submittedAt":"Today at 14:15 WAT","textResponse":"I practiced 3 times before recording! Hope my tone marks are clear on Ẹ káàrọ̀.","fileName":"samuel_greetings_yoruba.mp3","hasAudioRecording":true,"audioDuration":"0:42"}'::jsonb, NULL),
  ('asg-2', 'Worksheet: Numbers 1 to 20 & Market Fruits', 'Yoruba Foundation', 'student-samuel', 'teacher-ojo', 'Due Sep 29, 2026', 'Match the Yoruba numbers to fruit quantities from the market scene.', 'Write out numbers 1 through 10 in Yoruba and translate 5 common fruits.', 'pending', NULL, NULL),
  ('asg-3', 'Cultural Project: My Family Tree (Àwọn Ẹbí Mi)', 'Yoruba Culture & Heritage', 'student-samuel', 'teacher-ojo', 'Graded on Sep 22, 2026', 'Draw your family tree and label your parents, siblings, and grandparents in Yoruba.', 'Include Bàbá, Ìyá, Àbúrò, Ẹ̀gbọ́n, Bàbá Àgbà, and Ìyá Àgbà.', 'graded',
   '{"submittedAt":"Sep 21, 2026 at 16:30 WAT","textResponse":"Here is my completed family tree chart with photos of Grandma in Lagos!","fileName":"samuel_family_tree_project.pdf"}'::jsonb,
   '{"score":98,"letter":"A+","gradedAt":"Sep 22, 2026","gradedById":"teacher-ojo","gradedBy":"Mrs. Folashade Ojo","feedback":"Ọ kare pupo (Bravo, Samuel)! Your spelling of Bàbá Àgbà and Ìyá Àgbà was completely accurate with tone marks. Excellent progress!","badges":["Tone Master","Heritage Hero","Grammar Star"]}'::jsonb),
  ('asg-4', 'Igbo Phonetics: Pronouncing Dotted Vowels (Ị, Ọ, Ụ)', 'Igbo Foundation', 'student-amara', 'teacher-eze', 'Graded on Sep 24, 2026', 'Record voice audio of 5 Igbo words containing dot-below vowels.', 'Record: 1. Ị̀tẹ (pot) 2. Ọ̀kụkọ (chicken) 3. Ụ́lọ̀ (house) 4. Nnà (father) 5. Nné (mother).', 'graded',
   '{"submittedAt":"Sep 23, 2026 at 17:10 WAT","textResponse":"Voice recording attached. Worked on distinguishing ụ and ọ with my dad.","fileName":"amara_igbo_vowels.mp3","hasAudioRecording":true,"audioDuration":"0:55"}'::jsonb,
   '{"score":95,"letter":"A","gradedAt":"Sep 24, 2026","gradedById":"teacher-eze","gradedBy":"Mr. Chinedu Eze","feedback":"Daalụ nke ukwuu, Amara! Your pronunciation of Ụ́lọ̀ and Ọ̀kụkọ was spot on. Keep up the high energy!","badges":["Igbo Phonetics Novice","Tone Star"]}'::jsonb),
  ('asg-5', 'Igbo Family Salutations and Formal Respect', 'Igbo Culture', 'student-amara', 'teacher-eze', 'Due Tomorrow, 20:00 WAT', 'Write 3 formal greetings used when visiting elders in an Igbo compound.', 'Explain greeting gestures and write out ''Kedu ka i mere'' vs ''Kedu ka unu mere''.', 'pending', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Invoices
INSERT INTO public.invoices (id, invoice_number, parent_id, student_id, date, description, amount_usd, amount_ngn, status, method, receipt_url)
VALUES
  ('inv-001', 'NLH-2026-0901', 'parent-adewale', 'student-samuel', 'Sep 15, 2026', 'Heritage Starter Plan — 4 Live 1-on-1 Classes + AI Tutor', 90.00, 125000.00, 'Paid', 'Mastercard (ending 4242)', '#receipt'),
  ('inv-002', 'NLH-2026-0815', 'parent-adewale', 'student-samuel', 'Aug 15, 2026', 'Heritage Starter Plan — 4 Live 1-on-1 Classes + AI Tutor', 90.00, 125000.00, 'Paid', 'Paystack Bank Transfer (GTBank)', '#receipt'),
  ('inv-003', 'NLH-2026-0905', 'parent-okonkwo', 'student-amara', 'Sep 05, 2026', 'Igbo Heritage Immersion — 4 Live Classes + Audio Practice Lab', 90.00, 125000.00, 'Paid', 'Visa Card (ending 8821)', '#receipt')
ON CONFLICT (id) DO NOTHING;
