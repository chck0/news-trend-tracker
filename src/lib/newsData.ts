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
      // 💡 2. Authorization 헤더를 추가하여 인증 정보를 전달합니다.
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (!response.ok) {
      // API 호출 실패 시, 응답 상태를 함께 로그에 출력합니다.
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // API 응답을 TrendData 형식으로 변환
    if (Array.isArray(data)) {
      return data.map((item) => ({
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
      // 💡 2. Authorization 헤더를 추가하여 인증 정보를 전달합니다.
      {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    if (!response.ok) {
      // API 호출 실패 시, 응답 상태를 함께 로그에 출력합니다.
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // API 응답을 SentimentData 형식으로 변환
    if (Array.isArray(data)) {
      return data.map((item) => ({
        date: item.date,
        positive: item.sentiments.positive || 0,
        negative: item.sentiments.negative || 0,
        neutral: item.sentiments.neutral || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error("감성 데이터 조회 실패:", error);
    return [];
  }
}