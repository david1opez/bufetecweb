// NewsForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewsFormProps {
  news: {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
  };
  setNews: React.Dispatch<
    React.SetStateAction<{
      id?: string;
      title: string;
      description: string;
      imageUrl: string;
    }>
  >;
  onSubmit: () => void;
  isEditing: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({
  news,
  setNews,
  onSubmit,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Título (obligatorio)"
        value={news.title}
        onChange={(e) => setNews({ ...news, title: e.target.value })}
      />
      <Textarea
        placeholder="Descripción (obligatorio)"
        value={news.description}
        onChange={(e) => setNews({ ...news, description: e.target.value })}
      />
      <Input
        placeholder="URL de la imagen (dejar en blanco para imagen aleatoria)"
        value={news.imageUrl}
        onChange={(e) => setNews({ ...news, imageUrl: e.target.value })}
      />
      <Button
        onClick={onSubmit}
        className="font-bold"
        style={{ backgroundColor: "#14397F" }}
      >
        {isEditing ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );
};

export default NewsForm;
