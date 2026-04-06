import { Redis } from "@upstash/redis";
const redis = new Redis({
    url: "https://delicate-corgi-77067.upstash.io",
    token: "gQAAAAAAAS0LAAIncDI0MTU4ZTdiOGFkYjI0NmE1OWY0NjQwMWY4NDMzNGJkYnAyNzcwNjc",
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
