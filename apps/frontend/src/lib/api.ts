import { supabase } from "./supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchTracks() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tracks/`, {
    headers,
  });

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
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tracks/`, {
    method: "POST",
    headers,
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
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tracks/${trackId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch track: ${response.statusText}`);
  }

  return response.json();
}
