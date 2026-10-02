import { InterviewQuestion } from '../types/interview';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'pm-q3',
    number: 3,
    totalQuestions: 20,
    role: 'Lead Product Manager',
    code: '#PM-892',
    videoUrl: '/interview-1.mp4',
    questionText:
      'Ceritakan pengalaman paling menantang ketika Anda harus menyelaraskan prioritas roadmap produk antara permintaan tim sales yang mendesak dan keterbatasan teknis engineering. Bagaimana Anda menentukan keputusan akhirnya?',
    category: 'Product Strategy',
    interviewerName: 'Sarah Wicaksono',
    interviewerTitle: 'AI Recruiter',
    initialTranscript:
      'Pada kuartal lalu di perusahaan sebelumnya, tim sales menuntut fitur integrasi CRM kustom yang berpotensi menghasilkan kontrak 1,2 miliar rupiah. Di sisi lain, Tech Lead menyampaikan bahwa arsitektur backend kami memerlukan refactoring teknis agar latency tidak melonjak. Tindakan yang saya ambil adalah membuat RICE Scoring Matrix bersama kedua stakeholder, lalu menyepakati fase implementasi hybrid...',
    keywords: [
      'Tech Lead',
      'RICE Scoring Matrix',
      'kontrak 1,2 miliar rupiah',
      'refactoring teknis',
      'implementasi hybrid',
      'latency',
      'stakeholder',
    ],
    initialStar: {
      situation: {
        status: 'completed',
        score: 90,
        label: 'Terpenuhi (90%)',
        details: 'Konteks konflik prioritas sales vs tech debt terdefinisi secara jelas.',
      },
      task: {
        status: 'completed',
        score: 85,
        label: 'Terpenuhi (85%)',
        details: 'Tanggung jawab sebagai PM penentu keputusan telah disampaikan.',
      },
      action: {
        status: 'in_progress',
        score: 75,
        label: 'Sedang Berjalan (75%)',
        details: 'Menjelaskan penggunaan framework RICE dan mediasi antar departemen.',
      },
      result: {
        status: 'pending',
        score: 0,
        label: 'Belum Disebutkan',
        details: 'Metrik hasil akhir, dampak bisnis, atau retensi belum diuraikan.',
      },
    },
    initialFillerCount: 1,
    initialFillerDetails: [
      { word: 'ehmm', count: 1 },
      { word: 'kayaknya', count: 0 },
    ],
    initialWpm: 130,
    spontaneousTip:
      'Jangan lupa sebutkan metrik dampak bisnis (seperti peningkatan konversi retained client atau efisiensi sprint engineering) untuk melengkapi elemen Result.',
    idealAnswer: {
      situation:
        'Di Q3 tahun lalu pada startup SaaS B2B kami, tim Sales menandatangani LOI senilai 1,2 miliar rupiah dengan enterprise client yang mensyaratkan integrasi webhook CRM khusus dalam tempo 4 minggu. Namun, tim Engineering baru saja mendeteksi degradasi API 99.9th latency akibat utang teknis modul auth.',
      task:
        'Sebagai Lead PM, mandat saya adalah melindungi reliabilitas platform inti tanpa membuang peluang pendapatan strategis yang krusial bagi target ARR perusahaan.',
      action:
        'Saya menginisiasi workshop 2 hari berbasis RICE Scoring Matrix bersama Head of Sales dan Lead Architect. Kami membongkar requirement sales menjadi 2 fase: Fase 1 (MVP headless webhook semi-otomatis dengan limit rate terkontrol dalam 2 minggu) dan Fase 2 (integrasi mendalam paska refactoring modul auth). Saya juga menyusun SLA rollback dan mitigasi risiko transparan.',
      result:
        'Hasilnya, deal 1,2 miliar rupiah berhasil ditutup tepat waktu dengan NPS enterprise client mencapai 9/10, sementara latency API berhasil diturunkan 42% pada sprint berikutnya tanpa ada insiden downtime produksi.',
      fullText:
        'Di Q3 tahun lalu pada startup SaaS B2B kami, tim Sales menandatangani LOI senilai 1,2 miliar rupiah dengan enterprise client yang mensyaratkan integrasi webhook CRM khusus dalam tempo 4 minggu. Namun, tim Engineering baru saja mendeteksi degradasi API 99.9th latency akibat utang teknis modul auth. Sebagai Lead PM, mandat saya adalah melindungi reliabilitas platform inti tanpa membuang peluang pendapatan strategis yang krusial bagi target ARR perusahaan. Saya menginisiasi workshop 2 hari berbasis RICE Scoring Matrix bersama Head of Sales dan Lead Architect. Kami membongkar requirement sales menjadi 2 fase: Fase 1 (MVP headless webhook semi-otomatis dalam 2 minggu) dan Fase 2 (integrasi paska refactoring). Hasilnya, deal 1,2 miliar rupiah berhasil ditutup tepat waktu dengan NPS client 9/10, sementara latency API turun 42% tanpa ada insiden downtime produksi.',
      keyTakeaway:
        'Gunakan data objektif (RICE/ROI), bagi solusi ke fase MVP terukur, dan selalu sebutkan dampak ganda: metrik bisnis + kesehatan teknis.',
    },
  },
  {
    id: 'pm-q1',
    number: 1,
    totalQuestions: 20,
    role: 'Lead Product Manager',
    code: '#PM-892',
    questionText:
      'Bisa ceritakan latar belakang profesional Anda dan apa pencapaian produk terbesar yang pernah Anda pimpin sejauh ini?',
    category: 'Behavioral',
    interviewerName: 'Sarah Wicaksono',
    interviewerTitle: 'AI Recruiter',
    initialTranscript:
      'Saya memiliki pengalaman lebih dari 6 tahun di bidang manajemen produk digital khususnya fintech dan e-commerce. Di posisi terakhir, saya memimpin transformasi funnel checkout yang meningkatkan konversi transaksi sebesar 24% dalam kurun waktu dua kuartal...',
    keywords: [
      '6 tahun pengalaman',
      'fintech dan e-commerce',
      'funnel checkout',
      'konversi transaksi 24%',
      'dua kuartal',
    ],
    initialStar: {
      situation: {
        status: 'completed',
        score: 95,
        label: 'Terpenuhi (95%)',
        details: 'Latar belakang domain dan konteks produk disampaikan dengan ringkas.',
      },
      task: {
        status: 'completed',
        score: 90,
        label: 'Terpenuhi (90%)',
        details: 'Objektif optimasi funnel pembayaran terjelaskan.',
      },
      action: {
        status: 'completed',
        score: 80,
        label: 'Terpenuhi (80%)',
        details: 'Eksperimen A/B testing dan redesign checkout flow diuraikan.',
      },
      result: {
        status: 'completed',
        score: 85,
        label: 'Terpenuhi (85%)',
        details: 'Kenaikan 24% konversi terukur secara eksplisit.',
      },
    },
    initialFillerCount: 0,
    initialFillerDetails: [
      { word: 'ehmm', count: 0 },
      { word: 'kayaknya', count: 0 },
    ],
    initialWpm: 135,
    spontaneousTip:
      'Kaitkan pencapaian Anda dengan visi kepemimpinan tim agar pewawancara melihat kesiapan Anda di level Lead/Principal.',
    idealAnswer: {
      situation:
        'Selama 6 tahun memimpin produk fintech, saya berfokus pada efisiensi transaksi pembayaran digital di pasar SEA.',
      task:
        'Tantangan terbesar adalah tingginya drop-off rate 38% pada tahap 3-DS verifikasi pembayaran checkout.',
      action:
        'Saya memimpin tim lintas fungsi (data, UX, core payment) untuk meluncurkan seamless one-click tokenization dan adaptive routing.',
      result:
        'Tingkat konversi naik 24%, menghasilkan tambahan GMV tahunan senilai $4.2M dengan zero fraud incident.',
      fullText:
        'Selama 6 tahun memimpin produk fintech, saya memfokuskan karir pada efisiensi sistem transaksi. Di peran terakhir, drop-off rate checkout mencapai 38%. Saya memimpin inisiatif tokenization one-click dan smart authentication routing bersama tim engineering dan riset pengguna. Hasilnya, konversi naik 24% dan menambah GMV tahunan $4.2M.',
      keyTakeaway:
        'Format elevator pitch yang solid: Pengalaman inti -> Masalah terbesar -> Solusi inovatif -> Hasil bisnis kuantitatif.',
    },
  },
  {
    id: 'pm-q4',
    number: 4,
    totalQuestions: 20,
    role: 'Lead Product Manager',
    code: '#PM-892',
    questionText:
      'Bagaimana cara Anda mengukur Product-Market Fit (PMF) saat meluncurkan produk dari tahap 0 ke 1 (zero-to-one), dan apa metrik leading indicator yang paling Anda andalkan?',
    category: 'Product Strategy',
    interviewerName: 'Sarah Wicaksono',
    interviewerTitle: 'AI Recruiter',
    initialTranscript:
      'Untuk produk zero-to-one, saya biasanya mengandalkan Sean Ellis PMF survey 40% rule dipadukan dengan cohort retention curve hari ke-30. Pada salah satu produk baru, jika kurva retensi mendatar di atas 25%, itu menjadi sinyal valid bahwa core value proposition berhasil diterima pasar...',
    keywords: [
      'zero-to-one',
      'Sean Ellis PMF survey',
      'cohort retention curve',
      'retensi mendatar 25%',
      'core value proposition',
    ],
    initialStar: {
      situation: {
        status: 'completed',
        score: 90,
        label: 'Terpenuhi (90%)',
        details: 'Konteks peluncuran 0 to 1 dan metrik PMF relevan.',
      },
      task: {
        status: 'completed',
        score: 85,
        label: 'Terpenuhi (85%)',
        details: 'Penetapan leading vs lagging indicator.',
      },
      action: {
        status: 'completed',
        score: 85,
        label: 'Terpenuhi (85%)',
        details: 'Pengujian kohort dan survei kesedihan pengguna.',
      },
      result: {
        status: 'in_progress',
        score: 70,
        label: 'Sedang Berjalan (70%)',
        details: 'Beri contoh keputusan go/no-go nyata yang Anda buat dari data tersebut.',
      },
    },
    initialFillerCount: 1,
    initialFillerDetails: [
      { word: 'ehmm', count: 1 },
      { word: 'kayaknya', count: 0 },
    ],
    initialWpm: 128,
    spontaneousTip:
      'Beri contoh nyata bagaimana data PMF tersebut mengubah keputusan alokasi resource atau pivot fitur produk.',
    idealAnswer: {
      situation:
        'Saat menginkubasi produk kolaborasi internal B2B dari 0 ke 1 tahun 2024.',
      task:
        'Tugas saya adalah membuktikan PMF sebelum perusahaan mengalokasikan pendanaan seed tahap lanjut.',
      action:
        'Saya mengimplementasikan uji "Very Disappointed" Sean Ellis kepada 200 pengguna aktif mingguan dan melacak D30 retention plateau.',
      result:
        'Skor kekecewaan mencapai 48% (melampaui target 40%) dan D30 retention stabil di 32%, memberi justifikasi approval investasi $1.5M.',
      fullText:
        'Dalam produk 0-to-1, saya tidak menunggu lagging metric seperti revenue. Saya mengukur PMF lewat D30 retention curve flattening dan survei Sean Ellis: jika >40% user menjawab "sangat kecewa" jika produk dihentikan besok, ini leading indicator paling terpercaya. Pada produk kolaborasi terakhir kami, skor mencapai 48% dan D30 bertahan di 32%, yang langsung membuka lampu hijau ekspansi tim.',
      keyTakeaway:
        'Kombinasikan metrik kuantitatif (retention curves) dengan metrik emosional/kualitatif (Sean Ellis survey).',
    },
  },
];

export const AVAILABLE_ROLES = [
  {
    id: 'lead-pm',
    title: 'Lead Product Manager',
    code: '#PM-892',
    level: 'Senior / Lead',
    interviewer: 'Sarah Wicaksono (AI Recruiter)',
    duration: '25 Menit',
    totalQuestions: 20,
    topics: ['Product Strategy', 'Stakeholder Alignment', 'Data & Metrics', 'System Execution'],
  },
  {
    id: 'senior-swe',
    title: 'Senior Software Engineer (Backend/Distributed Systems)',
    code: '#SWE-419',
    level: 'Senior (L5/L6)',
    interviewer: 'Sarah Wicaksono (AI Recruiter)',
    duration: '30 Menit',
    totalQuestions: 20,
    topics: ['System Design', 'Concurrency', 'Microservices', 'Failure Resilience'],
  },
  {
    id: 'lead-designer',
    title: 'Lead UI/UX Product Designer',
    code: '#DES-108',
    level: 'Lead / Principal',
    interviewer: 'Sarah Wicaksono (AI Recruiter)',
    duration: '25 Menit',
    totalQuestions: 18,
    topics: ['Design Systems', 'User Research', 'Information Architecture', 'Product Impact'],
  },
  {
    id: 'data-scientist',
    title: 'Senior Data Analyst / BI Lead',
    code: '#DAT-771',
    level: 'Senior',
    interviewer: 'Sarah Wicaksono (AI Recruiter)',
    duration: '25 Menit',
    totalQuestions: 18,
    topics: ['A/B Experimentation', 'Cohort Analysis', 'Predictive Modeling', 'Executive Comm'],
  },
];
