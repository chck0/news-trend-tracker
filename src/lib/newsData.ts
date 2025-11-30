export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  keywords: string[];
}

export interface TrendData {
  date: string;
  count: number;
}

export interface SentimentData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

const API_URL = "https://jheqpdgpjexrgjpmehku.supabase.co/functions/v1";

export async function getTrendData(keyword: string): Promise<TrendData[]> {
  try {
    const response = await fetch(
      `${API_URL}/news-trends?keywords=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) {
      throw new Error("API 호출 실패");
    }
    const data = await response.json();

    console.log("트렌드 데이터 응답:", data);

    // API 응답을 TrendData 형식으로 변환
    if (Array.isArray(data.trends)) {
      return data.trends.map((item) => ({
        date: item.date,
        count: item.count || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error("트렌드 데이터 조회 실패:", error);
    return [];
  }
}

export async function getSentimentData(
  keyword: string
): Promise<SentimentData[]> {
  try {
    const response = await fetch(
      `${API_URL}/sentiment-trends?keywords=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) {
      throw new Error("API 호출 실패");
    }
    const data = await response.json();
    console.log("감성 데이터 응답:", data);
    // API 응답을 SentimentData 형식으로 변환
    if (Array.isArray(data.trends)) {
      return data.trends.map((item) => ({
        date: item.date,
        positive: item.counts.positive || 0,
        negative: item.counts.negative || 0,
        neutral: item.counts.neutral || 0,
      }));
    }
    console.log("감성 데이터 응답:", data);
    return [];
  } catch (error) {
    console.error("감성 데이터 조회 실패:", error);
    return [];
  }
}
