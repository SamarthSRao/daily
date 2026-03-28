import { Redis } from "@upstash/redis";
import type { VercelRequest, VercelResponse } from "@vercel/node";
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method, body, query } = req;
    const key = query.key as string;

    if (!key) {
        return res.status(400).json({ error: "Missing 'key' query parameter" });
    }

    try {
        if (method === 'GET') {
            const data = await redis.get(key);
            return res.status(200).json(data);
        }

        if (method === 'POST') {
            // Redis client will handle object serialization automatically
            await redis.set(key, body);
            return res.status(200).json({ ok: true });
        }
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }

    return res.status(405).json({ error: "Method not allowed" });
}