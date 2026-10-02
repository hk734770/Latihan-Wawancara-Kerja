-- ============================================================================
-- PROYEK: WawancaraAI (AI Job Interview Practice Platform)
-- TARGET: MySQL 8.0+ / MariaDB / Aiven MySQL / Cloud SQL / RDS
-- FILE  : database.sql
-- DESKRIPSI: Skema database relasional yang disesuaikan 100% dengan kebutuhan
--            fitur aplikasi WawancaraAI (STAR framework tracker, live teleprompter,
--            speech metrics/WPM, filler word audit, AI evaluation report, & paywall).
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 0. PEMBERSIHAN TABEL LAMA (IDEMPOTENT RESET)
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_interview_metrics;
DROP VIEW IF EXISTS v_session_summary;

DROP TABLE IF EXISTS report_question_details;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS client_fingerprints;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. TABEL UTAMA
-- ============================================================================

-- 1.1 CLIENT / DEVICE FINGERPRINT (Mitigasi Bypass Kuota Gratis)
CREATE TABLE client_fingerprints (
    client_id VARCHAR(64) PRIMARY KEY,              -- ID acak dari cookie/localStorage
    fingerprint_hash VARCHAR(128) NOT NULL,         -- Browser canvas/webgl hash
    last_ip_address VARCHAR(45) NOT NULL,           -- IPv4 / IPv6
    free_sessions_claimed INT DEFAULT 1 NOT NULL,   -- Melacak pemakaian kuota gratis
    first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_fingerprint_hash (fingerprint_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.2 MASTER ROLES (Posisi Pekerjaan & Konfigurasi Simulasi)
CREATE TABLE roles (
    role_id VARCHAR(50) PRIMARY KEY,                -- e.g. 'lead-pm', 'senior-swe', 'lead-designer'
    title VARCHAR(150) NOT NULL,                    -- e.g. 'Lead Product Manager'
    code VARCHAR(50) NOT NULL,                      -- e.g. '#PM-892'
    level VARCHAR(50) NOT NULL,                     -- e.g. 'Senior / Lead'
    interviewer VARCHAR(100) NOT NULL,              -- e.g. 'Sarah Wicaksono (AI Recruiter)'
    duration VARCHAR(50) DEFAULT '25 Menit' NOT NULL,
    total_questions INT DEFAULT 20 NOT NULL,
    topics JSON NOT NULL,                           -- Array topik wawancara: ["Product Strategy", "System Design"]
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.3 SESSIONS (State Mesin Sesi Wawancara Pengguna)
CREATE TABLE sessions (
    session_id VARCHAR(36) PRIMARY KEY,             -- UUID Sesi
    client_id VARCHAR(64) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    job_position VARCHAR(150) NOT NULL,             -- Nama peran saat sesi dibuat
    status ENUM(
        'CREATED',
        'IN_PROGRESS_FREE',
        'PAYWALL_LOCKED',
        'PAYMENT_PENDING',
        'IN_PROGRESS_PAID',
        'COMPLETED',
        'REPORT_READY',
        'PAYMENT_EXPIRED',
        'PAYMENT_FAILED',
        'ABANDONED'
    ) DEFAULT 'CREATED' NOT NULL,
    current_question_no INT DEFAULT 1 NOT NULL,    -- Nomor pertanyaan aktif (1-20)
    is_paid BOOLEAN DEFAULT FALSE NOT NULL,         -- Status pembayaran unlock Q6-Q20
    session_timer VARCHAR(10) DEFAULT '00:00' NOT NULL, -- Durasi latihan berjalan (mm:ss)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    completed_at DATETIME NULL,
    expires_at DATETIME NULL,                       -- Batas kadaluarsa sesi (24 jam)
    
    INDEX idx_sessions_client (client_id),
    INDEX idx_sessions_status (status),
    INDEX idx_sessions_role (role_id),
    CONSTRAINT fk_sessions_client FOREIGN KEY (client_id) REFERENCES client_fingerprints(client_id) ON DELETE RESTRICT,
    CONSTRAINT fk_sessions_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.4 QUESTIONS (Bank Soal & Pertanyaan Dinamis AI)
CREATE TABLE questions (
    question_id VARCHAR(50) PRIMARY KEY,            -- e.g. 'pm-q3', 'pm-q1', atau UUID
    role_id VARCHAR(50) NOT NULL,
    question_no INT NOT NULL,                      -- 1 s.d. 20
    total_questions INT DEFAULT 20 NOT NULL,
    role VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,                      -- e.g. '#PM-892'
    category ENUM(
        'Behavioral',
        'Leadership',
        'Technical',
        'Product Strategy'
    ) NOT NULL,
    question_text TEXT NOT NULL,
    interviewer_name VARCHAR(100) DEFAULT 'Sarah Wicaksono' NOT NULL,
    interviewer_title VARCHAR(100) DEFAULT 'AI Recruiter' NOT NULL,
    keywords JSON NOT NULL,                         -- Array kata kunci relevan: ["RICE", "latency"]
    ideal_answer JSON NOT NULL,                     -- { situation, task, action, result, fullText, keyTakeaway }
    initial_transcript TEXT NULL,                   -- Transkrip awal demo
    initial_star JSON NULL,                         -- Nilai awal STAR { situation: {...}, task: {...}, ... }
    initial_filler_count INT DEFAULT 0 NOT NULL,
    initial_filler_details JSON NULL,               -- [{"word": "ehmm", "count": 1}]
    initial_wpm INT DEFAULT 120 NOT NULL,
    spontaneous_tip TEXT NULL,                      -- Tips AI langsung yang ditampilkan di kartu tips
    ai_latency_ms INT NULL,                         -- Waktu respons Gemini
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

    INDEX idx_questions_role_no (role_id, question_no),
    CONSTRAINT fk_questions_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.5 ANSWERS (Jawaban Suara/Teks, Evaluasi STAR Live, & Speech Metrics)
CREATE TABLE answers (
    answer_id VARCHAR(36) PRIMARY KEY,             -- UUID Jawaban
    session_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    question_no INT NOT NULL,
    input_type ENUM('voice', 'text') DEFAULT 'voice' NOT NULL,
    raw_transcript TEXT NULL,                      -- Transkripsi audio mentah dari Web Speech/Whisper
    final_transcript TEXT NOT NULL,                -- Transkrip final yang dikonfirmasi pengguna
    audio_duration_seconds INT NULL,               -- Durasi bicara (detik)
    wpm INT DEFAULT 0 NOT NULL,                    -- Kecepatan bicara (Words Per Minute)
    filler_count INT DEFAULT 0 NOT NULL,           -- Total kata jeda/filler (ehmm, kayaknya, dll)
    filler_details JSON NULL,                      -- Rincian filler per kata: [{"word":"ehmm","count":2}]
    star_evaluation JSON NOT NULL,                 -- Status & nilai per pilar STAR: situation, task, action, result
    spontaneous_tip TEXT NULL,                     -- Rekomendasi perbaikan AI spontan saat rekaman
    is_edited_by_user BOOLEAN DEFAULT FALSE NOT NULL,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

    INDEX idx_answers_session (session_id),
    INDEX idx_answers_question (question_id),
    CONSTRAINT uq_session_question UNIQUE (session_id, question_id),
    CONSTRAINT fk_answers_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.6 PAYMENTS (Transaksi Paywall QRIS Pembuka Q6-Q20)
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,            -- UUID Pembayaran
    session_id VARCHAR(36) NOT NULL,
    payment_type ENUM('Q6_UNLOCK', 'NEW_SESSION') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,                -- e.g. 15000.00
    status ENUM('PENDING', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING' NOT NULL,
    qris_payload TEXT NOT NULL,                    -- String payload EMVCo QRIS
    qris_image_url TEXT NULL,                      -- URL QR code image
    gateway_name VARCHAR(50) DEFAULT 'MIDTRANS' NOT NULL,
    gateway_ref VARCHAR(100) NULL,                 -- Order ID / transaction ID gateway
    gateway_response JSON NULL,                    -- Log payload webhook dari payment gateway
    expires_at DATETIME NOT NULL,                  -- Batas waktu bayar (15 menit)
    paid_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,

    INDEX idx_payments_session (session_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_ref (gateway_ref),
    CONSTRAINT fk_payments_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.7 REPORTS (Laporan Komprehensif Evaluasi Akhir AI)
CREATE TABLE reports (
    report_id VARCHAR(36) PRIMARY KEY,             -- UUID Laporan
    session_id VARCHAR(36) NOT NULL,
    overall_score INT NOT NULL,                    -- Nilai keseluruhan 0 - 100
    verdict ENUM(
        'Strong Hire',
        'Hire',
        'Lean Hire',
        'Needs Improvement'
    ) NOT NULL,                                    -- Keputusan akhir rekrutmen
    star_score INT NOT NULL,                       -- Skor kelengkapan STAR (0-100)
    articulation_score INT NOT NULL,               -- Skor artikulasi & intonasi (0-100)
    depth_score INT NOT NULL,                      -- Kedalaman teknis (0-100)
    impact_score INT NOT NULL,                     -- Skor dampak bisnis (0-100)
    strengths JSON NOT NULL,                       -- Array poin keunggulan utama
    improvements JSON NOT NULL,                    -- Array poin area pengembangan
    filler_word_total INT DEFAULT 0 NOT NULL,      -- Total kata jeda selama sesi
    average_wpm INT DEFAULT 120 NOT NULL,          -- Rata-rata kecepatan bicara WPM
    feedback_summary TEXT NOT NULL,                -- Ulasan ringkas AI Recruiter
    ideal_alternative_snippet TEXT NULL,           -- Rekomendasi frasa alternatif ideal
    raw_ai_payload JSON NULL,                      -- Payload mentah respons LLM Gemini
    ai_generation_time_ms INT NULL,                -- Waktu pemrosesan API LLM
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

    INDEX idx_reports_session (session_id),
    CONSTRAINT uq_session_report UNIQUE (session_id),
    CONSTRAINT fk_reports_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.8 REPORT QUESTION DETAILS (Rincian Nilai per Soal untuk Accordion Modal)
CREATE TABLE report_question_details (
    detail_id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36) NOT NULL,
    question_no INT NOT NULL,
    score INT NOT NULL,                            -- Nilai ketepatan 0-100
    score_reason TEXT NOT NULL,                    -- Alasan penilaian AI
    star_breakdown JSON NULL,                      -- Status STAR per soal { situation, task, action, result }
    grammar_findings JSON NULL,                    -- Temuan tata bahasa: [{"excerpt": "...", "issue": "...", "suggestion": "..."}]
    improvement_tip TEXT NOT NULL,                 -- Tips konkret spesifik soal
    ideal_answer TEXT NOT NULL,                    -- Rekomendasi teks jawaban terbaik

    INDEX idx_report_details_report (report_id, question_no),
    CONSTRAINT uq_report_qno UNIQUE (report_id, question_no),
    CONSTRAINT fk_report_details_report FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. VIEWS (UNTUK DASHBOARD & AGREGASI METRIK APLIKASI)
-- ============================================================================

CREATE OR REPLACE VIEW v_session_summary AS
SELECT 
    s.session_id,
    s.client_id,
    s.job_position,
    r_role.title AS role_title,
    s.status AS session_status,
    s.current_question_no,
    s.is_paid,
    s.session_timer,
    COUNT(DISTINCT a.answer_id) AS total_answers_submitted,
    p.status AS payment_status,
    p.amount AS payment_amount,
    rep.overall_score,
    rep.verdict,
    rep.star_score,
    s.created_at,
    s.completed_at
FROM sessions s
LEFT JOIN roles r_role ON s.role_id = r_role.role_id
LEFT JOIN answers a ON s.session_id = a.session_id
LEFT JOIN payments p ON s.session_id = p.session_id AND p.status = 'PAID'
LEFT JOIN reports rep ON s.session_id = rep.session_id
GROUP BY 
    s.session_id, s.client_id, s.job_position, r_role.title, s.status, 
    s.current_question_no, s.is_paid, s.session_timer, p.status, p.amount,
    rep.overall_score, rep.verdict, rep.star_score, s.created_at, s.completed_at;

-- ============================================================================
-- 3. SEED DATA REALISTIS (MENYESUAIKAN DENGAN mockQuestions.ts)
-- ============================================================================

-- 3.1 Role Master Data
INSERT INTO roles (role_id, title, code, level, interviewer, duration, total_questions, topics) VALUES
('lead-pm', 'Lead Product Manager', '#PM-892', 'Senior / Lead', 'Sarah Wicaksono (AI Recruiter)', '25 Menit', 20, 
 '["Product Strategy", "Stakeholder Alignment", "Data & Metrics", "System Execution"]'),
('senior-swe', 'Senior Software Engineer (Backend/Distributed Systems)', '#SWE-419', 'Senior (L5/L6)', 'Sarah Wicaksono (AI Recruiter)', '30 Menit', 20, 
 '["System Design", "Concurrency", "Microservices", "Failure Resilience"]'),
('lead-designer', 'Lead UI/UX Product Designer', '#DES-108', 'Lead / Principal', 'Sarah Wicaksono (AI Recruiter)', '25 Menit', 18, 
 '["Design Systems", "User Research", "Information Architecture", "Product Impact"]'),
('data-scientist', 'Senior Data Analyst / BI Lead', '#DAT-771', 'Senior', 'Sarah Wicaksono (AI Recruiter)', '25 Menit', 18, 
 '["A/B Experimentation", "Cohort Analysis", "Predictive Modeling", "Executive Comm"]');

-- 3.2 Soal Wawancara Lead Product Manager (#PM-892)
INSERT INTO questions (
    question_id, role_id, question_no, total_questions, role, code, category, 
    question_text, interviewer_name, interviewer_title, keywords, ideal_answer, 
    initial_transcript, initial_star, initial_filler_count, initial_filler_details, 
    initial_wpm, spontaneous_tip, ai_latency_ms
) VALUES
(
    'pm-q1',
    'lead-pm',
    1,
    20,
    'Lead Product Manager',
    '#PM-892',
    'Behavioral',
    'Bisa ceritakan latar belakang profesional Anda dan apa pencapaian produk terbesar yang pernah Anda pimpin sejauh ini?',
    'Sarah Wicaksono',
    'AI Recruiter',
    '["6 tahun pengalaman", "fintech dan e-commerce", "funnel checkout", "konversi transaksi 24%", "dua kuartal"]',
    JSON_OBJECT(
        'situation', 'Selama 6 tahun memimpin produk fintech, saya berfokus pada efisiensi transaksi pembayaran digital di pasar SEA.',
        'task', 'Tantangan terbesar adalah tingginya drop-off rate 38% pada tahap 3-DS verifikasi pembayaran checkout.',
        'action', 'Saya memimpin tim lintas fungsi (data, UX, core payment) untuk meluncurkan seamless one-click tokenization dan adaptive routing.',
        'result', 'Tingkat konversi naik 24%, menghasilkan tambahan GMV tahunan senilai $4.2M dengan zero fraud incident.',
        'fullText', 'Selama 6 tahun memimpin produk fintech, saya memfokuskan karir pada efisiensi sistem transaksi. Di peran terakhir, drop-off rate checkout mencapai 38%. Saya memimpin inisiatif tokenization one-click dan smart authentication routing bersama tim engineering dan riset pengguna. Hasilnya, konversi naik 24% dan menambah GMV tahunan $4.2M.',
        'keyTakeaway', 'Format elevator pitch yang solid: Pengalaman inti -> Masalah terbesar -> Solusi inovatif -> Hasil bisnis kuantitatif.'
    ),
    'Saya memiliki pengalaman lebih dari 6 tahun di bidang manajemen produk digital khususnya fintech dan e-commerce. Di posisi terakhir, saya memimpin transformasi funnel checkout yang meningkatkan konversi transaksi sebesar 24% dalam kurun waktu dua kuartal...',
    JSON_OBJECT(
        'situation', JSON_OBJECT('status', 'completed', 'score', 95, 'label', 'Terpenuhi (95%)', 'details', 'Latar belakang domain dan konteks produk disampaikan dengan ringkas.'),
        'task', JSON_OBJECT('status', 'completed', 'score', 90, 'label', 'Terpenuhi (90%)', 'details', 'Objektif optimasi funnel pembayaran terjelaskan.'),
        'action', JSON_OBJECT('status', 'completed', 'score', 80, 'label', 'Terpenuhi (80%)', 'details', 'Eksperimen A/B testing dan redesign checkout flow diuraikan.'),
        'result', JSON_OBJECT('status', 'completed', 'score', 85, 'label', 'Terpenuhi (85%)', 'details', 'Kenaikan 24% konversi terukur secara eksplisit.')
    ),
    0,
    JSON_ARRAY(JSON_OBJECT('word', 'ehmm', 'count', 0), JSON_OBJECT('word', 'kayaknya', 'count', 0)),
    135,
    'Kaitkan pencapaian Anda dengan visi kepemimpinan tim agar pewawancara melihat kesiapan Anda di level Lead/Principal.',
    1280
),
(
    'pm-q3',
    'lead-pm',
    3,
    20,
    'Lead Product Manager',
    '#PM-892',
    'Product Strategy',
    'Ceritakan pengalaman paling menantang ketika Anda harus menyelaraskan prioritas roadmap produk antara permintaan tim sales yang mendesak dan keterbatasan teknis engineering. Bagaimana Anda menentukan keputusan akhirnya?',
    'Sarah Wicaksono',
    'AI Recruiter',
    '["Tech Lead", "RICE Scoring Matrix", "kontrak 1,2 miliar rupiah", "refactoring teknis", "implementasi hybrid", "latency", "stakeholder"]',
    JSON_OBJECT(
        'situation', 'Di Q3 tahun lalu pada startup SaaS B2B kami, tim Sales menandatangani LOI senilai 1,2 miliar rupiah dengan enterprise client yang mensyaratkan integrasi webhook CRM khusus dalam tempo 4 minggu. Namun, tim Engineering baru saja mendeteksi degradasi API 99.9th latency akibat utang teknis modul auth.',
        'task', 'Sebagai Lead PM, mandat saya adalah melindungi reliabilitas platform inti tanpa membuang peluang pendapatan strategis yang krusial bagi target ARR perusahaan.',
        'action', 'Saya menginisiasi workshop 2 hari berbasis RICE Scoring Matrix bersama Head of Sales dan Lead Architect. Kami membongkar requirement sales menjadi 2 fase: Fase 1 (MVP headless webhook semi-otomatis dengan limit rate terkontrol dalam 2 minggu) dan Fase 2 (integrasi mendalam paska refactoring modul auth). Saya juga menyusun SLA rollback dan mitigasi risiko transparan.',
        'result', 'Hasilnya, deal 1,2 miliar rupiah berhasil ditutup tepat waktu dengan NPS enterprise client mencapai 9/10, sementara latency API berhasil diturunkan 42% pada sprint berikutnya tanpa ada insiden downtime produksi.',
        'fullText', 'Di Q3 tahun lalu pada startup SaaS B2B kami, tim Sales menandatangani LOI senilai 1,2 miliar rupiah dengan enterprise client yang mensyaratkan integrasi webhook CRM khusus dalam tempo 4 minggu. Namun, tim Engineering baru saja mendeteksi degradasi API 99.9th latency akibat utang teknis modul auth. Sebagai Lead PM, mandat saya adalah melindungi reliabilitas platform inti tanpa membuang peluang pendapatan strategis yang krusial bagi target ARR perusahaan. Saya menginisiasi workshop 2 hari berbasis RICE Scoring Matrix bersama Head of Sales dan Lead Architect. Kami membongkar requirement sales menjadi 2 fase: Fase 1 (MVP headless webhook semi-otomatis dalam 2 minggu) dan Fase 2 (integrasi paska refactoring). Hasilnya, deal 1,2 miliar rupiah berhasil ditutup tepat waktu dengan NPS client 9/10, sementara latency API turun 42% tanpa ada insiden downtime produksi.',
        'keyTakeaway', 'Gunakan data objektif (RICE/ROI), bagi solusi ke fase MVP terukur, dan selalu sebutkan dampak ganda: metrik bisnis + kesehatan teknis.'
    ),
    'Pada kuartal lalu di perusahaan sebelumnya, tim sales menuntut fitur integrasi CRM kustom yang berpotensi menghasilkan kontrak 1,2 miliar rupiah. Di sisi lain, Tech Lead menyampaikan bahwa arsitektur backend kami memerlukan refactoring teknis agar latency tidak melonjak. Tindakan yang saya ambil adalah membuat RICE Scoring Matrix bersama kedua stakeholder, lalu menyepakati fase implementasi hybrid...',
    JSON_OBJECT(
        'situation', JSON_OBJECT('status', 'completed', 'score', 90, 'label', 'Terpenuhi (90%)', 'details', 'Konteks konflik prioritas sales vs tech debt terdefinisi secara jelas.'),
        'task', JSON_OBJECT('status', 'completed', 'score', 85, 'label', 'Terpenuhi (85%)', 'details', 'Tanggung jawab sebagai PM penentu keputusan telah disampaikan.'),
        'action', JSON_OBJECT('status', 'in_progress', 'score', 75, 'label', 'Sedang Berjalan (75%)', 'details', 'Menjelaskan penggunaan framework RICE dan mediasi antar departemen.'),
        'result', JSON_OBJECT('status', 'pending', 'score', 0, 'label', 'Belum Disebutkan', 'details', 'Metrik hasil akhir, dampak bisnis, atau retensi belum diuraikan.')
    ),
    1,
    JSON_ARRAY(JSON_OBJECT('word', 'ehmm', 'count', 1), JSON_OBJECT('word', 'kayaknya', 'count', 0)),
    130,
    'Jangan lupa sebutkan metrik dampak bisnis (seperti peningkatan konversi retained client atau efisiensi sprint engineering) untuk melengkapi elemen Result.',
    1450
),
(
    'pm-q4',
    'lead-pm',
    4,
    20,
    'Lead Product Manager',
    '#PM-892',
    'Product Strategy',
    'Bagaimana cara Anda mengukur Product-Market Fit (PMF) saat meluncurkan produk dari tahap 0 ke 1 (zero-to-one), dan apa metrik leading indicator yang paling Anda andalkan?',
    'Sarah Wicaksono',
    'AI Recruiter',
    '["zero-to-one", "Sean Ellis PMF survey", "cohort retention curve", "retensi mendatar 25%", "core value proposition"]',
    JSON_OBJECT(
        'situation', 'Saat menginkubasi produk kolaborasi internal B2B dari 0 ke 1 tahun 2024.',
        'task', 'Tugas saya adalah membuktikan PMF sebelum perusahaan mengalokasikan pendanaan seed tahap lanjut.',
        'action', 'Saya mengimplementasikan uji "Very Disappointed" Sean Ellis kepada 200 pengguna aktif mingguan dan melacak D30 retention plateau.',
        'result', 'Skor kekecewaan mencapai 48% (melampaui target 40%) dan D30 retention stabil di 32%, memberi justifikasi approval investasi $1.5M.',
        'fullText', 'Dalam produk 0-to-1, saya tidak menunggu lagging metric seperti revenue. Saya mengukur PMF lewat D30 retention curve flattening dan survei Sean Ellis: jika >40% user menjawab "sangat kecewa" jika produk dihentikan besok, ini leading indicator paling terpercaya. Pada produk kolaborasi terakhir kami, skor mencapai 48% dan D30 bertahan di 32%, yang langsung membuka lampu hijau ekspansi tim.',
        'keyTakeaway', 'Kombinasikan metrik kuantitatif (retention curves) dengan metrik emosional/kualitatif (Sean Ellis survey).'
    ),
    'Untuk produk zero-to-one, saya biasanya mengandalkan Sean Ellis PMF survey 40% rule dipadukan dengan cohort retention curve hari ke-30. Pada salah satu produk baru, jika kurva retensi mendatar di atas 25%, itu menjadi sinyal valid bahwa core value proposition berhasil diterima pasar...',
    JSON_OBJECT(
        'situation', JSON_OBJECT('status', 'completed', 'score', 90, 'label', 'Terpenuhi (90%)', 'details', 'Konteks peluncuran 0 to 1 dan metrik PMF relevan.'),
        'task', JSON_OBJECT('status', 'completed', 'score', 85, 'label', 'Terpenuhi (85%)', 'details', 'Penetapan leading vs lagging indicator.'),
        'action', JSON_OBJECT('status', 'completed', 'score', 85, 'label', 'Terpenuhi (85%)', 'details', 'Pengujian kohort dan survei kesedihan pengguna.'),
        'result', JSON_OBJECT('status', 'in_progress', 'score', 70, 'label', 'Sedang Berjalan (70%)', 'details', 'Beri contoh keputusan go/no-go nyata yang Anda buat dari data tersebut.')
    ),
    1,
    JSON_ARRAY(JSON_OBJECT('word', 'ehmm', 'count', 1), JSON_OBJECT('word', 'kayaknya', 'count', 0)),
    128,
    'Beri contoh nyata bagaimana data PMF tersebut mengubah keputusan alokasi resource atau pivot fitur produk.',
    1390
);

-- 3.3 Sample Fingerprint & Sesi Pengujian Live
INSERT INTO client_fingerprints (client_id, fingerprint_hash, last_ip_address, free_sessions_claimed)
VALUES ('client_demo_live_01', 'e2d3c4b5a6f7890123456789abcdef0123456789abcdef0123456789abcdef01', '127.0.0.1', 1);

INSERT INTO sessions (
    session_id, client_id, role_id, job_position, status, current_question_no, is_paid, session_timer
) VALUES (
    'sess-pm-demo-001',
    'client_demo_live_01',
    'lead-pm',
    'Lead Product Manager',
    'REPORT_READY',
    3,
    TRUE,
    '15:05'
);

-- 3.4 Sample Jawaban Live & Evaluasi STAR
INSERT INTO answers (
    answer_id, session_id, question_id, question_no, input_type,
    raw_transcript, final_transcript, audio_duration_seconds,
    wpm, filler_count, filler_details, star_evaluation, spontaneous_tip, is_edited_by_user
) VALUES (
    'ans-pm-001-q3',
    'sess-pm-demo-001',
    'pm-q3',
    3,
    'voice',
    'pada kuartal lalu di perusahaan sebelumnya tim sales menuntut fitur integrasi crm kustom yang berpotensi menghasilkan kontrak 1 koma 2 miliar rupiah di sisi lain tech lead menyampaikan arsitektur backend perlu refactoring',
    'Pada kuartal lalu di perusahaan sebelumnya, tim sales menuntut fitur integrasi CRM kustom yang berpotensi menghasilkan kontrak 1,2 miliar rupiah. Di sisi lain, Tech Lead menyampaikan bahwa arsitektur backend kami memerlukan refactoring teknis agar latency tidak melonjak. Tindakan yang saya ambil adalah membuat RICE Scoring Matrix bersama kedua stakeholder, lalu menyepakati fase implementasi hybrid...',
    65,
    130,
    1,
    JSON_ARRAY(JSON_OBJECT('word', 'ehmm', 'count', 1), JSON_OBJECT('word', 'kayaknya', 'count', 0)),
    JSON_OBJECT(
        'situation', JSON_OBJECT('status', 'completed', 'score', 90, 'label', 'Terpenuhi (90%)', 'details', 'Konteks konflik prioritas sales vs tech debt terdefinisi secara jelas.'),
        'task', JSON_OBJECT('status', 'completed', 'score', 85, 'label', 'Terpenuhi (85%)', 'details', 'Tanggung jawab sebagai PM penentu keputusan telah disampaikan.'),
        'action', JSON_OBJECT('status', 'in_progress', 'score', 75, 'label', 'Sedang Berjalan (75%)', 'details', 'Menjelaskan penggunaan framework RICE dan mediasi antar departemen.'),
        'result', JSON_OBJECT('status', 'pending', 'score', 0, 'label', 'Belum Disebutkan', 'details', 'Metrik hasil akhir, dampak bisnis, atau retensi belum diuraikan.')
    ),
    'Jangan lupa sebutkan metrik dampak bisnis (seperti peningkatan konversi retained client atau efisiensi sprint engineering) untuk melengkapi elemen Result.',
    TRUE
);

-- 3.5 Sample Laporan Evaluasi AI Komprehensif
INSERT INTO reports (
    report_id, session_id, overall_score, verdict, star_score, articulation_score,
    depth_score, impact_score, strengths, improvements, filler_word_total, average_wpm,
    feedback_summary, ideal_alternative_snippet, ai_generation_time_ms
) VALUES (
    'rep-pm-demo-001',
    'sess-pm-demo-001',
    88,
    'Strong Hire',
    92,
    88,
    85,
    86,
    JSON_ARRAY(
        'Penyampaian STAR sangat terstruktur dengan pemisahan konteks yang jelas antara sales & tech constraints.',
        'Penggunaan framework objektif (RICE Scoring Matrix) menunjukkan kedewasaan dalam kepemimpinan produk.',
        'Kecepatan bicara (WPM) berada pada rentang ideal dengan filler words yang sangat minim.'
    ),
    JSON_ARRAY(
        'Tambahkan metrik leading indicator jangka panjang (misal: technical debt velocity recovery rate) selain dampak revenue.',
        'Sertakan refleksi retrospektif singkat tentang apa yang dapat dioptimalkan jika menghadapi skenario serupa di masa depan.'
    ),
    1,
    130,
    'Jawaban Anda merefleksikan standar Lead Product Manager kelas dunia. Anda mampu mengartikulasikan kompromi sulit antara pertumbuhan komersial dan arsitektur teknis dengan tenang, terstruktur, dan berbasis data terukur.',
    'Gunakan formulasi: "Menyeimbangkan 1.2M IDR deal dengan 99.9th latency SLA lewat implementasi 2 fase hybrid."',
    2150
);

-- 3.6 Sample Rincian Evaluasi per Pertanyaan (Accordion Modal)
INSERT INTO report_question_details (
    detail_id, report_id, question_no, score, score_reason,
    star_breakdown, grammar_findings, improvement_tip, ideal_answer
) VALUES (
    'det-pm-001-q3',
    'rep-pm-demo-001',
    3,
    88,
    'Mampu menyelesaikan konflik prioritas dengan framework terukur (RICE) dan kompromi arsitektural yang seimbang.',
    JSON_OBJECT(
        'situation', 'Sangat jelas (90%)',
        'task', 'Tepat sasaran (85%)',
        'action', 'Solusi hybrid konkret (75%)',
        'result', 'Perlu kuantifikasi metrik retensi (0%)'
    ),
    JSON_ARRAY(
        JSON_OBJECT(
            'excerpt', 'tim sales menuntut fitur integrasi',
            'issue', 'Bahasa dapat dibuat lebih diplomatis',
            'suggestion', 'tim sales mengadvokasikan kebutuhan integrasi strategis'
        )
    ),
    'Sertakan SLA numerik konkret untuk meyakinkan interviewer terhadap reliabilitas sistem.',
    'Di Q3 tahun lalu pada startup SaaS B2B kami, tim Sales menandatangani LOI senilai 1,2 miliar rupiah dengan enterprise client yang mensyaratkan integrasi webhook CRM khusus dalam tempo 4 minggu. Namun, tim Engineering baru saja mendeteksi degradasi API 99.9th latency akibat utang teknis modul auth. Sebagai Lead PM, mandat saya adalah melindungi reliabilitas platform inti tanpa membuang peluang pendapatan strategis yang krusial bagi target ARR perusahaan...'
);

-- ----------------------------------------------------------------------------
-- SELESAI
-- ----------------------------------------------------------------------------