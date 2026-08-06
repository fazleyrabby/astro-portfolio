import { supabase } from "./supabase";
import fs from "fs";
import path from "path";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  status: string;
  published_at: string;
  updated_at: string;
  cover_image?: string;
  lang: string;
  translation_of?: string;
  featured?: boolean;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), "src", "data", "posts.json");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "supabase-posts.json");

// TTL (Time To Live) in milliseconds:
const isProd = import.meta.env.PROD || process.env.NODE_ENV === "production";
const TTL = isProd ? 5 * 60 * 1000 : 15 * 1000;

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const localData = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
      return JSON.parse(localData);
    }

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    let useCache = false;
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < TTL) {
        useCache = true;
      }
    }

    if (useCache) {
      const cacheData = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(cacheData);
    }
  } catch (err) {
    console.warn("Posts cache read failed, falling back to live fetch:", err);
  }

  // Fetch live from Supabase
  console.log("🛈 Fetching posts live from Supabase...");
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published");

  if (error) {
    console.error("Failed to fetch posts from Supabase:", error);
    // If we have stale cache, fallback to it on error
    if (fs.existsSync(CACHE_FILE)) {
      console.warn("Using stale cache fallback due to Supabase error.");
      const cacheData = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(cacheData);
    }
    return [];
  }

  const posts = data || [];

  // Write to cache file asynchronously
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(posts, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to cache file:", err);
  }

  return posts;
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function getAllPosts(lang: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  
  // Filter: lang in ['en', lang]
  const filtered = posts.filter((p) => p.lang === "en" || p.lang === lang);
  
  // Sort: published_at desc
  return filtered.sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });
}

export async function getFallbackPost(slug: string): Promise<Post | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug && p.lang === "en");
}

export async function getTranslationPost(
  postId: string,
  translationOfId: string | undefined,
  currentLang: string
): Promise<Post | undefined> {
  const posts = await getPublishedPosts();
  if (currentLang === "en") {
    return posts.find((p) => p.translation_of === postId);
  } else {
    if (translationOfId) {
      return posts.find((p) => p.id === translationOfId);
    }
  }
  return undefined;
}

export async function getLatestPosts(lang: string, limit: number): Promise<Post[]> {
  const posts = await getPublishedPosts();
  
  // Filter by exact lang and sort by published_at desc
  const filtered = posts.filter((p) => p.lang === lang);
  const sorted = filtered.sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });
  
  return sorted.slice(0, limit);
}
