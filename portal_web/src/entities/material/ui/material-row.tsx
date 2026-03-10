// src/entities/material/ui/material-row.tsx
import { File, FileBadge, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { materials } from "@/db/schema";

interface MaterialRowProps {
  data: typeof materials.$inferSelect & {
    downloadUrl?: string; // Ссылка (подписанная или прямая)
  };
}

export function MaterialRow({ data }: MaterialRowProps) {
  // Простая логика определения иконки
  const isPdf = data.fileUrl.endsWith(".pdf");
  
  let Icon = File;
  let iconColor = "text-gray-500";
  let bgColor = "bg-gray-100";

  if (isPdf) {
    Icon = FileBadge;
    iconColor = "text-red-500";
    bgColor = "bg-red-50";
  } else {
    Icon = FileText;
    iconColor = "text-blue-500";
    bgColor = "bg-blue-50";
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
      <div className="flex items-center gap-4">
        {/* Иконка */}
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        
        {/* Инфо */}
        <div>
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {data.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{data.createdAt ? new Date(data.createdAt).toLocaleDateString("ru-RU") : ""}</span>
            {data.description && (
                <>
                    <span>•</span>
                    <span className="line-clamp-1 max-w-[200px]">{data.description}</span>
                </>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка действия */}
      <div>
        <a href={data.downloadUrl || "#"} target="_blank" rel="noreferrer">
            {isPdf ? (
            <Button variant="outline" size="sm" className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Открыть</span>
            </Button>
            ) : (
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Скачать</span>
            </Button>
            )}
        </a>
      </div>
    </div>
  );
}