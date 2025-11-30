import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { SentimentDataPoint } from '@/utils/mockNewsData';

interface SentimentChartProps {
  data: SentimentDataPoint[];
  keyword: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold text-foreground">
                {entry.name === '감성점수' ? entry.value.toFixed(2) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-positive" />
        <span className="text-xs text-muted-foreground">긍정</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-negative" />
        <span className="text-xs text-muted-foreground">부정</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-neutral" />
        <span className="text-xs text-muted-foreground">중립</span>
      </div>
    </div>
  );
};

export const SentimentChart = ({ data, keyword }: SentimentChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Calculate totals for legend
  const totals = data.reduce(
    (acc, d) => ({
      positive: acc.positive + d.positive,
      negative: acc.negative + d.negative,
      neutral: acc.neutral + d.neutral,
    }),
    { positive: 0, negative: 0, neutral: 0 }
  );

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          <div className="p-1.5 rounded-lg bg-positive/10 text-positive">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div className="p-1.5 rounded-lg bg-negative/10 text-negative">
            <ThumbsDown className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">감성 분석</h3>
          <p className="text-sm text-muted-foreground">
            "<span className="text-primary">{keyword}</span>" 긍정/부정 뉴스 분포
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-positive/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-positive font-mono">{totals.positive}</p>
          <p className="text-xs text-muted-foreground">긍정 뉴스</p>
        </div>
        <div className="bg-negative/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-negative font-mono">{totals.negative}</p>
          <p className="text-xs text-muted-foreground">부정 뉴스</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-neutral font-mono">{totals.neutral}</p>
          <p className="text-xs text-muted-foreground">중립 뉴스</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 30% 20%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(215 20% 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(215 20% 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[-1, 1]}
              stroke="hsl(215 20% 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="positive" 
              name="긍정"
              fill="hsl(174 72% 56%)" 
              radius={[2, 2, 0, 0]}
              stackId="sentiment"
            />
            <Bar 
              yAxisId="left"
              dataKey="negative" 
              name="부정"
              fill="hsl(12 76% 61%)" 
              radius={[2, 2, 0, 0]}
              stackId="sentiment"
            />
            <Bar 
              yAxisId="left"
              dataKey="neutral" 
              name="중립"
              fill="hsl(215 20% 55%)" 
              radius={[2, 2, 0, 0]}
              stackId="sentiment"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="score"
              name="감성점수"
              stroke="hsl(45 100% 60%)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <CustomLegend />
    </div>
  );
};
