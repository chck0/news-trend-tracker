import { useState } from "react";
import { KeywordSearch } from "@/components/KeywordSearch";
import { TrendChart } from "@/components/TrendChart";
import { SentimentChart } from "@/components/SentimentChart";
import { getTrendData, getSentimentData, TrendData, SentimentData } from "@/lib/newsData";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

  const handleSearch = async (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setTrendData([]);
    setSentimentData([]);
    
    const [trends, sentiments] = await Promise.all([
      getTrendData(searchKeyword),
      getSentimentData(searchKeyword),
    ]);
    
    setTrendData(trends);
    setSentimentData(sentiments);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">뉴스 대시보드</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            키워드별 뉴스 트렌드와 감성 분석을 확인하세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <KeywordSearch onSearch={handleSearch} />
        </div>

        {/* Charts */}
        {keyword && (
          <div className="space-y-6">
            <TrendChart data={trendData} keyword={keyword} />
            <SentimentChart data={sentimentData} keyword={keyword} />
          </div>
        )}

        {/* Empty State */}
        {!keyword && (
          <div className="text-center py-16">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              키워드를 검색하여 시작하세요
            </h2>
            <p className="text-muted-foreground">
              예: AI, 클라우드, 기술 등의 키워드로 뉴스 트렌드를 분석할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
