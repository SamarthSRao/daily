import { Redis } from "@upstash/redis";
const redis = new Redis({
    url: "https://delicate-corgi-77067.upstash.io",
    token: "gQAAAAAAAS0LAAIncDI0MTU4ZTdiOGFkYjI0NmE1OWY0NjQwMWY4NDMzNGJkYnAyNzcwNjc",
});

async function check() {
    const key = "properrr-daily-tasks";
    const data = await redis.get(key);
    console.log("Key:", key);
    console.log("Type:", typeof data);
    console.log("Data:", JSON.stringify(data));
}

check();
