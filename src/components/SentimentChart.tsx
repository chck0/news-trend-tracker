import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SentimentData } from "@/lib/newsData";

interface SentimentChartProps {
  data: SentimentData[];
  keyword: string;
}

export function SentimentChart({ data, keyword }: SentimentChartProps) {
  const totalPositive = data.reduce((sum, item) => sum + item.positive, 0);
  const totalNegative = data.reduce((sum, item) => sum + item.negative, 0);
  const totalNeutral = data.reduce((sum, item) => sum + item.neutral, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">감성 분석</CardTitle>
        <CardDescription>
          "{keyword}" 키워드의 날짜별 긍정/부정 뉴스 트렌드
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-positive" />
            <span>긍정: {totalPositive}건</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-negative" />
            <span>부정: {totalNegative}건</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral" />
            <span>중립: {totalNeutral}건</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="hsl(var(--positive))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--positive))", r: 4 }}
                activeDot={{ r: 6 }}
                name="긍정"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="hsl(var(--negative))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--negative))", r: 4 }}
                activeDot={{ r: 6 }}
                name="부정"
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="hsl(var(--neutral))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--neutral))", r: 4 }}
                activeDot={{ r: 6 }}
                name="중립"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
