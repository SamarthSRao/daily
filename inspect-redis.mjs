import { Redis } from "@upstash/redis";
const redis = new Redis({
    url: "***REMOVED***",
    token: "***REMOVED***",
});

async function check() {
    const key = "properrr-daily-tasks";
    const data = await redis.get(key);
    console.log("Key:", key);
    console.log("Type:", typeof data);
    console.log("Data:", JSON.stringify(data));
}

check();
