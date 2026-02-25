/**
 * Static data API with in-memory cache. Fetches from /data/*.json.
 * No backend required; cache prevents repeated network requests.
 */

const CACHE = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const BASE = process.env.PUBLIC_URL || "";

async function fetchJson(path) {
  const url = `${BASE}/data/${path}`;
  if (CACHE[url] && Date.now() - (CACHE[url].at || 0) < CACHE_TTL_MS) {
    return CACHE[url].data;
  }
  const res = await fetch(url, { cache: "default" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();
  CACHE[url] = { data, at: Date.now() };
  return data;
}

export async function getServices() {
  try {
    return await fetchJson("services.json");
  } catch (e) {
    console.error("getServices", e);
    return [];
  }
}

export async function getProjects(category = null, featured = null) {
  try {
    let list = await fetchJson("projects.json");
    if (category) list = list.filter((p) => p.category === category);
    if (featured !== null) list = list.filter((p) => p.featured === featured);
    return list;
  } catch (e) {
    console.error("getProjects", e);
    return [];
  }
}

export async function getProjectBySlug(slug) {
  try {
    const list = await fetchJson("projects.json");
    return list.find((p) => p.slug === slug) || null;
  } catch (e) {
    console.error("getProjectBySlug", e);
    return null;
  }
}

export async function getTestimonials() {
  try {
    const list = await fetchJson("testimonials.json");
    return (list || []).filter((t) => t.approved !== false);
  } catch (e) {
    console.error("getTestimonials", e);
    return [];
  }
}

export async function getTeam() {
  try {
    const list = await fetchJson("team.json");
    return (list || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (e) {
    console.error("getTeam", e);
    return [];
  }
}

export async function getCompanyStats() {
  try {
    return await fetchJson("company-stats.json");
  } catch (e) {
    console.error("getCompanyStats", e);
    return null;
  }
}

export async function getServiceBySlug(slug) {
  try {
    const list = await fetchJson("services.json");
    return list.find((s) => s.slug === slug) || null;
  } catch (e) {
    console.error("getServiceBySlug", e);
    return null;
  }
}
