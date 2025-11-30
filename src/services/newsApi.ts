// News API Service - connects to external Supabase edge functions

const NEWS_TRENDS_URL = 'https://jheqpdgpjexrgjpmehku.supabase.co/functions/v1/news-trends';
const SENTIMENT_TRENDS_URL = 'https://jheqpdgpjexrgjpmehku.supabase.co/functions/v1/sentiment-trends';

export interface TrendDataPoint {
  date: string;
  count: number;
}

export interface SentimentDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  score: number;
}

export interface NewsTrendsResponse {
  data?: TrendDataPoint[];
  error?: string;
}

export interface SentimentTrendsResponse {
  data?: SentimentDataPoint[];
  error?: string;
}

export const fetchNewsTrends = async (keyword: string): Promise<TrendDataPoint[]> => {
  try {
    console.log(`Fetching news trends for keyword: ${keyword}`);
    const url = `${NEWS_TRENDS_URL}?keywords=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('News trends API error:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('News trends response:', result);
    
    // Handle different response formats
    if (Array.isArray(result)) {
      return result.map(item => ({
        date: item.date || item.Date || item.DATE,
        count: item.count || item.Count || item.COUNT || item.mentions || item.Mentions || 0,
      }));
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data.map((item: any) => ({
        date: item.date || item.Date || item.DATE,
        count: item.count || item.Count || item.COUNT || item.mentions || item.Mentions || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching news trends:', error);
    throw error;
  }
};

export const fetchSentimentTrends = async (keyword: string): Promise<SentimentDataPoint[]> => {
  try {
    console.log(`Fetching sentiment trends for keyword: ${keyword}`);
    const url = `${SENTIMENT_TRENDS_URL}?keywords=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Sentiment trends API error:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sentiment trends response:', result);
    
    // Handle different response formats
    const parseItem = (item: any): SentimentDataPoint => ({
      date: item.date || item.Date || item.DATE,
      positive: item.positive || item.Positive || item.POSITIVE || 0,
      negative: item.negative || item.Negative || item.NEGATIVE || 0,
      neutral: item.neutral || item.Neutral || item.NEUTRAL || 0,
      score: item.score || item.Score || item.SCORE || item.sentiment_score || 0,
    });

    if (Array.isArray(result)) {
      return result.map(parseItem);
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data.map(parseItem);
    }

    return [];
  } catch (error) {
    console.error('Error fetching sentiment trends:', error);
    throw error;
  }
};

// Calculate statistics from the data
export const calculateStats = (trendData: TrendDataPoint[], sentimentData: SentimentDataPoint[]) => {
  const totalMentions = trendData.reduce((sum, d) => sum + d.count, 0);
  const avgMentions = trendData.length > 0 ? totalMentions / trendData.length : 0;
  const maxMentions = trendData.length > 0 ? Math.max(...trendData.map(d => d.count)) : 0;
  
  const totalPositive = sentimentData.reduce((sum, d) => sum + d.positive, 0);
  const totalNegative = sentimentData.reduce((sum, d) => sum + d.negative, 0);
  const totalNeutral = sentimentData.reduce((sum, d) => sum + d.neutral, 0);
  const totalSentiment = totalPositive + totalNegative + totalNeutral;
  
  const avgScore = sentimentData.length > 0 
    ? sentimentData.reduce((sum, d) => sum + d.score, 0) / sentimentData.length 
    : 0;
  
  return {
    totalMentions,
    avgMentions: Math.round(avgMentions * 10) / 10,
    maxMentions,
    totalPositive,
    totalNegative,
    totalNeutral,
    avgScore: Math.round(avgScore * 100) / 100,
    positiveRatio: totalSentiment > 0 
      ? Math.round((totalPositive / totalSentiment) * 100) 
      : 0,
  };
};
