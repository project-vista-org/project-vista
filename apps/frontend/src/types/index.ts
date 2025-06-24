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
  userId: string;
  title: string;
  articles: WikipediaArticle[];
  createdAt: string;
  updatedAt: string;
}

export interface WikipediaSearchResult {
  title: string;
  url: string;
  description: string;
}
