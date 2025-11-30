import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendData } from "@/lib/newsData";

interface TrendChartProps {
  data: TrendData[];
  keyword: string;
}

export function TrendChart({ data, keyword }: TrendChartProps) {
  const totalMentions = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">키워드 언급 트렌드</CardTitle>
        <CardDescription>
          "{keyword}" 키워드의 날짜별 언급 빈도 (총 {totalMentions}회)
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
                name="언급 횟수"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
