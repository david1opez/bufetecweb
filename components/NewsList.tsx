// NewsList.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";

interface News {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface NewsListProps {
  news: News[];
  onDelete: (id: string) => void;
  onEdit: (news: News) => void;
}

const NewsList: React.FC<NewsListProps> = ({ news, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {news.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-[#14397F] line-clamp-2">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={item.imageUrl || "/api/placeholder/300/200"}
                alt={item.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {item.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 bg-gray-50 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(item)}
              className="flex-1 font-semibold text-[#14397F] border-[#14397F] hover:bg-[#14397F] hover:text-white transition-colors duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(item.id)}
              className="flex-1 font-semibold text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NewsList;
