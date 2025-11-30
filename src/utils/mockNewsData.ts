// Mock news data generator for demonstration
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
}

export interface TrendDataPoint {
  date: string;
  count: number;
}

export interface SentimentDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  score: number; // -1 to 1 scale
}

// Generate dates for the last 30 days
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock keywords that appear in our "news database"
const mockKeywords = [
  'AI', '인공지능', '삼성', '애플', '테슬라', 'ChatGPT', '경제', '주식',
  '부동산', '금리', '환율', '코로나', '반도체', '배터리', '전기차',
  '메타버스', '블록체인', '비트코인', '스타트업', 'IT'
];

// Generate mock trend data for a keyword
export const generateTrendData = (keyword: string): TrendDataPoint[] => {
  const dates = generateDates(30);
  const isKnownKeyword = mockKeywords.some(k => 
    k.toLowerCase().includes(keyword.toLowerCase()) || 
    keyword.toLowerCase().includes(k.toLowerCase())
  );
  
  const baseCount = isKnownKeyword ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 10);
  
  return dates.map((date, index) => {
    // Add some variation and trend
    const trend = Math.sin(index / 5) * 10;
    const noise = (Math.random() - 0.5) * 20;
    const count = Math.max(0, Math.round(baseCount + trend + noise));
    
    return { date, count };
  });
};

// Generate mock sentiment data for a keyword
export const generateSentimentData = (keyword: string): SentimentDataPoint[] => {
  const dates = generateDates(30);
  const isKnownKeyword = mockKeywords.some(k => 
    k.toLowerCase().includes(keyword.toLowerCase()) || 
    keyword.toLowerCase().includes(k.toLowerCase())
  );
  
  const basePositive = isKnownKeyword ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 5);
  const baseNegative = isKnownKeyword ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3);
  
  return dates.map((date, index) => {
    const posNoise = (Math.random() - 0.3) * 10;
    const negNoise = (Math.random() - 0.3) * 8;
    
    const positive = Math.max(0, Math.round(basePositive + posNoise + Math.sin(index / 4) * 5));
    const negative = Math.max(0, Math.round(baseNegative + negNoise + Math.cos(index / 4) * 3));
    const neutral = Math.max(0, Math.round((positive + negative) * 0.3 + Math.random() * 5));
    
    const total = positive + negative + neutral;
    const score = total > 0 ? (positive - negative) / total : 0;
    
    return { date, positive, negative, neutral, score: Math.round(score * 100) / 100 };
  });
};

// Calculate summary statistics
export const calculateStats = (trendData: TrendDataPoint[], sentimentData: SentimentDataPoint[]) => {
  const totalMentions = trendData.reduce((sum, d) => sum + d.count, 0);
  const avgMentions = totalMentions / trendData.length;
  const maxMentions = Math.max(...trendData.map(d => d.count));
  
  const totalPositive = sentimentData.reduce((sum, d) => sum + d.positive, 0);
  const totalNegative = sentimentData.reduce((sum, d) => sum + d.negative, 0);
  const totalNeutral = sentimentData.reduce((sum, d) => sum + d.neutral, 0);
  const avgScore = sentimentData.reduce((sum, d) => sum + d.score, 0) / sentimentData.length;
  
  return {
    totalMentions,
    avgMentions: Math.round(avgMentions * 10) / 10,
    maxMentions,
    totalPositive,
    totalNegative,
    totalNeutral,
    avgScore: Math.round(avgScore * 100) / 100,
    positiveRatio: Math.round((totalPositive / (totalPositive + totalNegative + totalNeutral)) * 100),
  };
};
