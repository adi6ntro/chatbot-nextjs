import type { NextApiRequest, NextApiResponse } from 'next';

// Rate limiter sederhana per IP/session (contoh, bisa pakai redis untuk skala besar)
const ipHit: Record<string, number> = {};

const RATE_LIMIT = 10; // request per menit

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body as { message?: string };
    if (!message || message.length > 400) {
        return res.status(400).json({ reply: '[Pesan kosong/terlalu panjang]' });
    }

    // Simple IP rate limit (Demo, bukan untuk produksi skala besar)
    const ip = req.headers["x-real-ip"] as string || req.socket.remoteAddress || 'anonymous';
    ipHit[ip] = (ipHit[ip] || 0) + 1;
    setTimeout(() => ipHit[ip] = Math.max(0, ipHit[ip] - 1), 60_000);
    if (ipHit[ip] > RATE_LIMIT) {
        return res.status(429).json({ reply: '[Terlalu banyak request, coba lagi nanti]' });
    }

    try {
        // Contoh proxy aman: redirect permintaan ke LLM, API key di backend (.env.local)
        const backendReply = await fetch(process.env.API_CHATBOT_BACKEND!, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_CHATBOT_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message })
        });
        const data = await backendReply.json();

        // Ubah sesuai format output backend
        return res.status(200).json({ reply: data.reply ?? '[Tidak ada balasan]' });
    } catch (e) {
        return res.status(500).json({ reply: '[Gagal menghubungi server chatbot]' });
    }
}