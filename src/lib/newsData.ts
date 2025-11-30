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

// 💡 1. 환경 변수에서 Supabase Anon Key를 불러옵니다.
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_URL = "https://jheqpdgpjexrgjpmehku.supabase.co/functions/v1";

export async function getTrendData(keyword: string): Promise<TrendData[]> {
  try {
    const response = await fetch(
      `${API_URL}/news-trends?keywords=${encodeURIComponent(keyword)}`,
      // 💡 2. 인증 헤더 추가
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    console.log("트렌드 데이터 응답:", data);

    // 💡 3. API 응답이 { trends: [...] } 구조임을 감안하여 data.trends 배열을 사용합니다.
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
      `${API_URL}/sentiment-trends?keywords=${encodeURIComponent(keyword)}`,
      // 💡 2. 인증 헤더 추가
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    console.log("감성 데이터 응답:", data);

    // 💡 3. API 응답이 { trends: [...] } 구조임을 감안하여 data.trends 배열을 사용합니다.
    if (Array.isArray(data.trends)) {
      return data.trends.map((item) => ({
        date: item.date,
        // 💡 4. 데이터 경로를 item.sentiments 대신 item.counts 또는 item.sentiments로 변경
        // 여기서는 item.sentiments로 가정하고, 옵셔널 체이닝으로 안전하게 처리합니다.
        positive: item.sentiments?.positive || 0,
        negative: item.sentiments?.negative || 0,
        neutral: item.sentiments?.neutral || 0,
      }));
    }
    
    return [];
  } catch (error) {
    console.error("감성 데이터 조회 실패:", error);
    return [];
  }
}
