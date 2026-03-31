import { Redis } from "@upstash/redis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let redis: Redis | null = null;

function getRedis() {
    if (!redis) {
        let url = process.env.UPSTASH_REDIS_REST_URL || "";
        let token = process.env.UPSTASH_REDIS_REST_TOKEN || "";

        // Strip literal quotes if they were pasted into Vercel UI
        url = url.replace(/['"]+/g, '');
        token = token.replace(/['"]+/g, '');

        if (!url || !token) {
            throw new Error("Missing Redis environment variables (UPSTASH_REDIS_REST_URL/TOKEN)");
        }

        redis = new Redis({
            url: url,
            token: token,
        });
    }
    return redis;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Allow CORS for local dev
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { method, body, query } = req;
    const key = query.key as string;

    if (!key) {
        return res.status(400).json({ error: "Missing 'key' query parameter" });
    }

    try {
        const client = getRedis();

        if (method === "GET") {
            const data = await client.get<any>(key);
            if (data === null || data === undefined) {
                return res.status(200).json(null);
            }
            // Upstash may return a string if it was stored as JSON string — parse it
            if (typeof data === "string") {
                try {
                    return res.status(200).json(JSON.parse(data));
                } catch {
                    return res.status(200).json(data);
                }
            }
            return res.status(200).json(data);
        }

        if (method === "POST") {
            // body is already parsed by Vercel as an object (Content-Type: application/json)
            // Store as a native object if possible, otherwise stringify
            const dataToStore = typeof body === "string" ? body : JSON.stringify(body);
            await client.set(key, dataToStore);
            return res.status(200).json({ ok: true });
        }
    } catch (err: any) {
        console.error("Redis handler error:", err);
        return res.status(500).json({ error: err.message });
    }

    return res.status(405).json({ error: "Method not allowed" });
}