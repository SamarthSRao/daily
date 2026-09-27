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

async function test() {
    try {
        const key = "test-connection-from-p2";
        const val = { time: Date.now(), msg: "Antigravity testing connection" };
        console.log("Setting key:", key);
        await redis.set(key, val);
        const retrieved = await redis.get(key);
        console.log("Retrieved:", retrieved);
        if (retrieved && retrieved.msg === val.msg) {
            console.log("Redis Connection: SUCCESS");
        } else {
            console.log("Redis Connection: FAILED (mismatch)");
        }
    } catch (e) {
        console.error("Redis Connection: FAILED", e.message);
    }
}

test();
