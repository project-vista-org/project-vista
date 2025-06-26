export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface WikipediaArticle {
  title: string;
  url: string;
  description?: string;
  completed?: boolean;
}

export interface Track {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  articles: WikipediaArticle[];
  created_at: string;
  updated_at: string;
}

export interface WikipediaSearchResult {
  title: string;
  url: string;
  description: string;
}
