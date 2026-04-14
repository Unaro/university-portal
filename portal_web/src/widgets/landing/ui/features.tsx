// src/widgets/landing/ui/features.tsx
import { Search, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Почему выбирают нас?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Мы упростили процесс поиска практики и работы, убрав бюрократию и добавив умные технологии.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Search size={28} />}
            color="text-primary bg-primary/10"
            title="Умный подбор"
            desc="Алгоритмы подбирают вакансии на основе ваших навыков и курса. Больше никакого спама."
          />
          <FeatureCard
            icon={<FileText size={28} />}
            color="text-accent-foreground bg-accent/50"
            title="Документы онлайн"
            desc="Генерация направлений на практику и резюме в один клик. Без очередей в деканат."
          />
          <FeatureCard
            icon={<CheckCircle2 size={28} />}
            color="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
            title="Проверенные компании"
            desc="Все работодатели проходят модерацию ВУЗом. Гарантия безопасности и официального оформления."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 ${color}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}