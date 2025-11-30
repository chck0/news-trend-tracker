import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KeywordInputProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
}

export const KeywordInput = ({ onSearch, isLoading }: KeywordInputProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  const quickKeywords = ['AI', '삼성', '테슬라', '비트코인', '반도체'];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">키워드 분석</h2>
          <p className="text-sm text-muted-foreground">뉴스 트렌드와 감성 분석</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="분석할 키워드를 입력하세요..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!keyword.trim() || isLoading}
          className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all"
        >
          {isLoading ? '분석 중...' : '분석하기'}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground mr-2">빠른 검색:</span>
        {quickKeywords.map((kw) => (
          <button
            key={kw}
            onClick={() => {
              setKeyword(kw);
              onSearch(kw);
            }}
            className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
};
