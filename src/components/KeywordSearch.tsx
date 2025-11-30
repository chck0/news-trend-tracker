import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface KeywordSearchProps {
  onSearch: (keyword: string) => void;
}

export function KeywordSearch({ onSearch }: KeywordSearchProps) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        placeholder="검색할 키워드를 입력하세요 (예: AI, 클라우드)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" />
        검색
      </Button>
    </form>
  );
}
