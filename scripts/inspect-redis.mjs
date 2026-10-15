import { Redis } from "@upstash/redis";

const url = (process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/^['"]|['"]$/g, "");
const token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim().replace(/^['"]|['"]$/g, "");
if (!url || !token) {
    console.error("Error: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.");
    process.exit(1);
}

const redis = new Redis({
    url,
    token,
});

async function check() {
    const key = "properrr-daily-tasks";
    const data = await redis.get(key);
    console.log("Key:", key);
    console.log("Type:", typeof data);
    console.log("Data:", JSON.stringify(data));
}

check();
