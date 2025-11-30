import { useState } from 'react';
import { Newspaper, BarChart3, TrendingUp, Activity, ThumbsUp, Gauge, AlertCircle } from 'lucide-react';
import { KeywordInput } from '@/components/dashboard/KeywordInput';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { 
  fetchNewsTrends,
  fetchSentimentTrends,
  calculateStats,
  TrendDataPoint,
  SentimentDataPoint 
} from '@/services/newsApi';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentDataPoint[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (searchKeyword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both APIs in parallel
      const [trendResult, sentimentResult] = await Promise.all([
        fetchNewsTrends(searchKeyword),
        fetchSentimentTrends(searchKeyword),
      ]);

      console.log('Trend data:', trendResult);
      console.log('Sentiment data:', sentimentResult);

      if (trendResult.length === 0 && sentimentResult.length === 0) {
        toast({
          title: '검색 결과 없음',
          description: `"${searchKeyword}" 키워드에 대한 데이터가 없습니다.`,
          variant: 'destructive',
        });
        setError('검색 결과가 없습니다.');
        return;
      }

      const calculatedStats = calculateStats(trendResult, sentimentResult);
      
      setKeyword(searchKeyword);
      setTrendData(trendResult);
      setSentimentData(sentimentResult);
      setStats(calculatedStats);

      toast({
        title: '분석 완료',
        description: `"${searchKeyword}" 키워드 분석이 완료되었습니다.`,
      });
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast({
        title: '오류 발생',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

        {/* Error State */}
        {error && !isLoading && keyword && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="p-4 rounded-full bg-negative/10 mb-4">
              <AlertCircle className="w-10 h-10 text-negative" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">데이터를 불러올 수 없습니다</h3>
            <p className="text-muted-foreground text-center max-w-md">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {keyword && stats && !error && (
          <>
            {/* Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="총 언급 횟수"
                value={stats.totalMentions.toLocaleString()}
                subtitle={`${trendData.length}일간`}
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
              {trendData.length > 0 && (
                <TrendChart data={trendData} keyword={keyword} />
              )}
              {sentimentData.length > 0 && (
                <SentimentChart data={sentimentData} keyword={keyword} />
              )}
            </section>
          </>
        )}

        {/* Empty State */}
        {!keyword && !isLoading && (
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="p-4 rounded-full bg-primary/10 mb-6 animate-pulse-soft">
              <Activity className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              데이터 분석 중...
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              뉴스 데이터를 분석하고 있습니다. 잠시만 기다려주세요.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            실시간 뉴스 데이터 분석 대시보드
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
