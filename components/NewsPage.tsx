// NewsPage.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Plus } from "lucide-react";
import NewsList from "./NewsList";

interface News {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface NewsPageProps {
  news: News[];
  onDelete: (id: string) => void;
  onCreateNews: () => void;
  onEditNews: (news: News) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({
  news,
  onDelete,
  onCreateNews,
  onEditNews,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-[#14397F] flex items-center">
          <Newspaper className="mr-2" />
          Portal de Noticias
        </CardTitle>
        <Button
          onClick={onCreateNews}
          className="font-bold"
          style={{ backgroundColor: "#14397F" }}
        >
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Noticia
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-6">
          Crea y modifica las noticias que se muestran en la vista de abogado.
        </p>
        <NewsList news={news} onDelete={onDelete} onEdit={onEditNews} />
      </CardContent>
    </Card>
  );
};

export default NewsPage;
