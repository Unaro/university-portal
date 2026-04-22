// src/entities/organization/ui/organization-card.tsx
import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { organizations } from "@/db/schema";
import Image from "next/image";

interface OrganizationCardProps {
  data: typeof organizations.$inferSelect & {
    vacanciesCount?: number; // Это поле мы будем вычислять в запросе
  };
}

export function OrganizationCard({ data }: OrganizationCardProps) {
  // Генерируем цвет заглушки логотипа на основе ID (чтобы не было скучно)
  const colors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-orange-500", "bg-sky-500", "bg-slate-600"];
  const logoColor = colors[data.id % colors.length];

  return (
    <Link href={`/practices?search=${encodeURIComponent(data.name)}`} className="group h-full block">
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted group-hover:border-primary/30 flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 pb-3">
          {data.logo ? (
             // Если есть лого - показываем (используем unoptimized так как это внешний S3/MinIO)
             <Image 
               src={data.logo} 
               alt={data.name} 
               width={56} 
               height={56} 
               unoptimized 
               className="w-14 h-14 rounded-xl object-contain border" 
             />
          ) : (
             <div className={`w-14 h-14 rounded-xl ${logoColor} flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md shrink-0`}>
               {data.name.charAt(0)}
             </div>
          )}

          <div>
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {data.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Briefcase className="h-3 w-3" /> Партнер ВУЗа
            </p>
          </div>
        </CardHeader>

        <CardContent className="pb-4 text-foreground/80 flex-grow text-sm">
          <p className="line-clamp-3 mb-4 min-h-[4.5em]">
            {data.description || "Описание отсутствует."}
          </p>

          {/* Контакты / ИИН как теги */}
          <div className="flex flex-wrap gap-2 mb-4">
             <Badge variant="secondary" className="font-normal text-xs bg-muted">
               ИИН: {data.iin}
             </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
            <MapPin className="h-3 w-3" /> {data.website || "Сайт не указан"}
          </div>
        </CardContent>

        <CardFooter className="pt-0 mt-auto">
          {data.vacanciesCount && data.vacanciesCount > 0 ? (
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Подробнее [Количество вакансий: {data.vacanciesCount}]
            </Button>
          ) : (
            <Button variant="ghost" disabled className="w-full bg-muted text-muted-foreground">
              Нет активных вакансий
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}