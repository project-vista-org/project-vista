import { supabase } from "./supabase";
import { logger } from "./logger";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://13.61.194.192";

async function getAuthHeaders() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error);
    throw new Error("Authentication error");
  }

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

// Add a wrapper function for API calls with automatic retry on token expiry
export async function apiCall(url: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 8);

  // Log the API request
  logger.logApiRequest(method, url, requestId);

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Calculate request duration
    const duration = Date.now() - startTime;

    // If we get a 401, try to refresh the session and retry once
    if (response.status === 401) {
      logger.warn("Token expired, attempting refresh", { url, requestId });
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        logger.error("Session refresh failed", {
          error: error.message,
          url,
          requestId,
        });
        throw new Error("Session expired, please log in again");
      }

      // Retry with new token
      const newHeaders = await getAuthHeaders();
      const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      });

      // Log the retry response
      const retryDuration = Date.now() - startTime;
      logger.logApiResponse(
        method,
        url,
        retryResponse.status,
        retryDuration,
        requestId,
      );

      return retryResponse;
    }

    // Log the response
    logger.logApiResponse(method, url, response.status, duration, requestId);

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      "API call failed",
      {
        url,
        method,
        duration,
        requestId,
        error: error instanceof Error ? error.message : String(error),
      },
      error instanceof Error ? error : undefined,
    );
    throw error;
  }
}

export async function fetchTracks() {
  const response = await apiCall("/api/tracks/");

  if (!response.ok) {
    throw new Error(`Failed to fetch tracks: ${response.statusText}`);
  }

  return response.json();
}

export async function createTrack(
  title: string,
  articles: any[],
  description?: string,
) {
  const response = await apiCall("/api/tracks/", {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      articles,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create track: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchTrack(trackId: string) {
  const response = await apiCall(`/api/tracks/${trackId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch track: ${response.statusText}`);
  }

  return response.json();
}

export async function updateTrack(
  trackId: string,
  updateData: {
    title?: string;
    description?: string;
    articles?: any[];
  },
) {
  const response = await apiCall(`/api/tracks/${trackId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update track: ${response.statusText}`);
  }

  return response.json();
}
