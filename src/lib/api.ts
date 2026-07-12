import type {
  CategoryDetail,
  CategorySummary,
  IndicatorSeries,
  RegionProfile,
  RegionSummary,
  SearchResult,
} from "./types";

// Two different addresses can point at the same backend: the browser needs one it can
// reach itself (NEXT_PUBLIC_API_URL — baked into the client bundle at build time, so in a
// same-origin reverse-proxy deployment this is set to "" and requests resolve as relative
// paths against whatever origin the page loaded from). Server-side rendering runs inside
// the Next.js container itself though, where a relative path can't be resolved by Node's
// fetch — there, API_INTERNAL_URL (server-only, never sent to the client) can point
// straight at the backend container over the Docker network, skipping the public proxy
// entirely. Locally, only NEXT_PUBLIC_API_URL is set and both sides use it.
if (process.env.NEXT_PUBLIC_API_URL === undefined) {
  throw new Error("NEXT_PUBLIC_API_URL is not set. See README for required environment variables.");
}

const API_BASE_URL = typeof window === "undefined" ? (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL) : process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, revalidateSeconds = 300): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getRegions: () => apiFetch<RegionSummary[]>("/api/regions", 600),
  getRegion: (slug: string) => apiFetch<RegionProfile>(`/api/regions/${encodeURIComponent(slug)}`, 120),
  getCategories: () => apiFetch<CategorySummary[]>("/api/categories", 900),
  getCategory: (slug: string) => apiFetch<CategoryDetail>(`/api/categories/${encodeURIComponent(slug)}`, 300),
  getIndicatorSeries: (slug: string, year?: number) =>
    apiFetch<IndicatorSeries>(`/api/indicators/${encodeURIComponent(slug)}${year ? `?year=${year}` : ""}`, 300),
  search: async (query: string): Promise<SearchResult[]> => {
    if (query.trim().length < 2) return [];
    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    return response.json();
  },
};

export { ApiError };
