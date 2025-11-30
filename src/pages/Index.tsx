import { useState } from 'react';
import { Newspaper, BarChart3, TrendingUp, Activity, ThumbsUp, Gauge } from 'lucide-react';
import { KeywordInput } from '@/components/dashboard/KeywordInput';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { 
  generateTrendData, 
  generateSentimentData, 
  calculateStats,
  TrendDataPoint,
  SentimentDataPoint 
} from '@/utils/mockNewsData';

const Index = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentDataPoint[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchKeyword: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const trend = generateTrendData(searchKeyword);
    const sentiment = generateSentimentData(searchKeyword);
    const calculatedStats = calculateStats(trend, sentiment);
    
    setKeyword(searchKeyword);
    setTrendData(trend);
    setSentimentData(sentiment);
    setStats(calculatedStats);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">News Dashboard</h1>
              <p className="text-xs text-muted-foreground">뉴스 트렌드 & 감성 분석</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <KeywordInput onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Results Section */}
        {keyword && stats && (
          <>
            {/* Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="총 언급 횟수"
                value={stats.totalMentions.toLocaleString()}
                subtitle="지난 30일"
                icon={BarChart3}
                delay={0}
              />
              <StatsCard
                title="일평균 언급"
                value={stats.avgMentions}
                subtitle="건/일"
                icon={Activity}
                delay={50}
              />
              <StatsCard
                title="긍정 비율"
                value={`${stats.positiveRatio}%`}
                subtitle={`긍정 ${stats.totalPositive}건`}
                icon={ThumbsUp}
                trend="positive"
                delay={100}
              />
              <StatsCard
                title="평균 감성점수"
                value={stats.avgScore > 0 ? `+${stats.avgScore}` : stats.avgScore}
                subtitle="-1 ~ +1 범위"
                icon={Gauge}
                trend={stats.avgScore > 0.1 ? 'positive' : stats.avgScore < -0.1 ? 'negative' : 'neutral'}
                delay={150}
              />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendChart data={trendData} keyword={keyword} />
              <SentimentChart data={sentimentData} keyword={keyword} />
            </section>
          </>
        )}

        {/* Empty State */}
        {!keyword && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="p-4 rounded-full bg-primary/5 mb-6">
              <TrendingUp className="w-12 h-12 text-primary/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              키워드를 입력하세요
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              분석하고 싶은 키워드를 입력하면 뉴스 트렌드와 감성 분석 결과를 확인할 수 있습니다.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            현재 데모 데이터로 동작합니다. 실제 뉴스 데이터 연동이 필요합니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
