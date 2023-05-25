import Redis from "ioredis";
import { env } from "../env/server.mjs";

const client = new Redis(env.REDIS_DB_URL);

export const getCache = async (key: string) => {
  const cache = await client.get(key);
  return cache ? JSON.parse(cache) : null;
};

export const setCache = async (key: string, data: [] | null) => {
  await client.set(key, JSON.stringify(data));
  await client.expire(key, 1000);
};