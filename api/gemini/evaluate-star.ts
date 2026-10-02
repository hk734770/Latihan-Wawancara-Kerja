import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questionText, candidateTranscript, role } = req.body || {};

  if (!candidateTranscript || candidateTranscript.trim().length < 5) {
    return res.status(200).json({
      success: true,
      star: {
        situation: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Konteks masalah belum diuraikan.' },
        task: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Peran dan target belum disampaikan.' },
        action: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Langkah konkret belum disampaikan.' },
        result: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Metrik atau dampak belum disebutkan.' },
      },
      tip: 'Mulailah dengan menjelaskan konteks situasi (Situation) dan masalah yang Anda hadapi secara ringkas.',
      fillers: [
        { word: 'ehmm', count: 0 },
        { word: 'kayaknya', count: 0 },
      ],
      totalFillers: 0,
    });
  }

  // Count filler words
  const textLower = candidateTranscript.toLowerCase();
  const fillers = [
    { word: 'ehmm', count: (textLower.match(/ehmm|ehm|hmm|umm|uhm/g) || []).length },
    { word: 'kayaknya', count: (textLower.match(/kayaknya|mungkin|kira-kira|kayak/g) || []).length },
  ];
  const totalFillers = fillers.reduce((acc, f) => acc + f.count, 0);

  // Gemini evaluation if API key available
  if (aiClient) {
    try {
      const prompt = `Anda adalah AI Recruiter & Interview Coach profesional di perusahaan teknologi tier-1 (FAANG/Unicorn).
Evaluasi jawaban wawancara berikut untuk posisi: "${role || 'Lead Product Manager'}".
Pertanyaan Pewawancara: "${questionText}"
Jawaban Kandidat (Transkrip suara): "${candidateTranscript}"

Berikan penilaian objektif STAR Framework dalam format JSON murni:
{
  "situation": { "status": "completed"|"in_progress"|"pending", "score": number(0-100), "label": string, "details": string },
  "task": { "status": "completed"|"in_progress"|"pending", "score": number(0-100), "label": string, "details": string },
  "action": { "status": "completed"|"in_progress"|"pending", "score": number(0-100), "label": string, "details": string },
  "result": { "status": "completed"|"in_progress"|"pending", "score": number(0-100), "label": string, "details": string },
  "tip": string
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim());
      return res.status(200).json({
        success: true,
        star: parsed,
        tip: parsed.tip,
        fillers,
        totalFillers,
      });
    } catch (err) {
      console.warn('Gemini evaluation fallback to heuristics:', err);
    }
  }

  // Fallback heuristic evaluation
  const hasSituation = /kuartal|perusahaan|proyek|tim|ketika|saat|tahun|klien|kustom|integrasi|sebelumnya/i.test(candidateTranscript);
  const hasTask = /tanggung jawab|target|tugas|objektif|mandat|menuntut|memerlukan|prioritas/i.test(candidateTranscript);
  const hasAction = /tindakan|mengambil|membuat|matrix|rice|workshop|diskusi|refactoring|arsitektur|analisis|eksekusi|fase/i.test(candidateTranscript);
  const hasResult = /hasilnya|dampaknya|persen|%|miliar|naik|turun|sukses|nps|roi|retensi|metrik|deal/i.test(candidateTranscript);

  const star = {
    situation: {
      status: hasSituation ? 'completed' : 'pending',
      score: hasSituation ? 90 : 20,
      label: hasSituation ? 'Terpenuhi (90%)' : 'Belum Lengkap',
      details: hasSituation ? 'Konteks dan latar belakang masalah terdeskripsikan.' : 'Konteks masalah belum diuraikan.',
    },
    task: {
      status: hasTask ? 'completed' : 'pending',
      score: hasTask ? 85 : 30,
      label: hasTask ? 'Terpenuhi (85%)' : 'Belum Lengkap',
      details: hasTask ? 'Tanggung jawab dan peranan kandidat jelas.' : 'Fokus tanggung jawab belum spesifik.',
    },
    action: {
      status: hasAction ? (hasResult ? 'completed' : 'in_progress') : 'pending',
      score: hasAction ? (hasResult ? 90 : 75) : 35,
      label: hasAction ? (hasResult ? 'Terpenuhi (90%)' : 'Sedang Berjalan (75%)') : 'Belum Lengkap',
      details: hasAction ? 'Langkah konkret dan metodologi telah disampaikan.' : 'Perlu langkah konkret yang terperinci.',
    },
    result: {
      status: hasResult ? 'completed' : 'pending',
      score: hasResult ? 85 : 0,
      label: hasResult ? 'Terpenuhi (85%)' : 'Belum Disebutkan',
      details: hasResult ? 'Metrik hasil akhir dan dampak bisnis terukur.' : 'Jangan lupa sebutkan metrik dampak bisnis akhir.',
    },
  };

  const tip = !hasResult
    ? 'Jangan lupa sebutkan metrik dampak bisnis (seperti peningkatan konversi retained client atau efisiensi sprint engineering) untuk melengkapi elemen Result.'
    : 'Bagus! Anda telah melengkapi seluruh elemen STAR. Pastikan artikulasi tetap tenang dan percaya diri.';

  return res.status(200).json({
    success: true,
    star,
    tip,
    fillers,
    totalFillers,
  });
}
