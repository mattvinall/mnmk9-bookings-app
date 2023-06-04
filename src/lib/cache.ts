import Redis from "ioredis";
import { env } from "../env/server.mjs";

const client = new Redis(env.REDIS_DB_URL);

export const getCache = async (key: string) => {
  try {
    const cache = await client.get(key);
    await client.expire(key, 60 * 60);
    return cache ? JSON.parse(cache) : null;
  } catch (error) {

  }
};

export const setCache = async <T>(key: string, data: T) => {
  try {
    await client.set(key, JSON.stringify(data));
    await client.expire(key, 60 * 60);
  } catch (error) {
    console.log(`Error setting cache for key: ${key}`, error);
  }
};

export const invalidateCache = async (key: string) => {
  try {
    await client.del(key);
    console.log(`Cache invalidated for key: ${key}`)
  } catch (error) {
    console.log(`Error invalidating cache for key: ${key}`, error);
  }
}