
export interface WikipediaSearchResult {
  title: string;
  url: string;
  description: string;
}

export async function searchWikipediaArticles(query: string): Promise<WikipediaSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Use Wikipedia's OpenSearch API for autocomplete suggestions
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/title/${encodeURIComponent(query)}`;
    
    // Alternative approach using the search API
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=8&origin=*`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to search Wikipedia');
    }

    const data = await response.json();
    
    if (!data.query || !data.query.search) {
      return [];
    }

    return data.query.search.map((item: any) => ({
      title: item.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      description: item.snippet.replace(/<[^>]*>/g, '') // Remove HTML tags
    }));
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return [];
  }
}

export function getWikipediaUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
}
