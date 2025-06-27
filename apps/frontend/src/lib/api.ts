import { supabase } from "./supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // If we get a 401, try to refresh the session and retry once
    if (response.status === 401) {
      console.log("Token expired, attempting refresh...");
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Session refresh failed:", error);
        // Redirect to login or handle auth failure
        throw new Error("Session expired, please log in again");
      }

      // Retry with new token
      const newHeaders = await getAuthHeaders();
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      });
    }

    return response;
  } catch (error) {
    console.error("API call failed:", error);
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
