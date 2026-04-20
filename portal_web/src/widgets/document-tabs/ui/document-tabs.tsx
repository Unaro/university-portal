// src/widgets/document-tabs/ui/document-tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { MaterialRow } from "@/entities/material/ui/material-row";
import { MaterialForm } from "@/features/manage-materials/ui/material-form"; // Импортируем форму
import { Material } from "@/shared/types/db";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMaterial } from "@/app/actions/material";

interface DocumentTabsProps {
  materials: (Material & { downloadUrl?: string })[];
  isAdmin: boolean;
}

export function DocumentTabs({ materials, isAdmin }: DocumentTabsProps) {
  // Фильтруем на клиенте
  const regulatory = materials.filter(m => m.category === 'regulatory');
  const templates = materials.filter(m => m.category === 'template');
  const useful = materials.filter(m => m.category === 'material' || !m.category);

  // Хелпер для рендера списка с кнопкой удаления
  const renderList = (list: typeof materials, emptyText: string) => (
    <div className="space-y-4">
      {list.length > 0 ? (
         list.map(doc => (
           <div key={doc.id} className="group relative">
             <MaterialRow data={doc} />
             {/* Кнопка удаления для Админа (появляется при наведении или всегда) */}
             {isAdmin && (
               <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-background/80 p-1 rounded shadow-sm">
                  <form action={async () => { "use server"; await deleteMaterial(doc.id); }}> {/* Исправить удаление файла из сервера S3 */}
                    <Button variant="destructive" size="icon" className="h-8 w-8" title="Удалить">
                      <Trash2 size={14} /> {/* Исправить меню удаления материала(налезание на кнопку скачивания) */}
                    </Button>
                  </form>
               </div>
             )}
           </div>
         ))
      ) : (
         <p className="text-muted-foreground text-center py-8">{emptyText}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Блок добавления для Админа (над табами) */}
      {isAdmin && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-primary mb-4">Панель администратора</h3>
          <MaterialForm />
        </div>
      )}

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-muted">
          <TabsTrigger value="materials" className="py-3">Полезные материалы</TabsTrigger>
          <TabsTrigger value="regulatory" className="py-3">Нормативные акты</TabsTrigger>
          <TabsTrigger value="templates" className="py-3">Шаблоны заявлений</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
           <Card>
            <CardHeader><CardTitle>Материалы и инструкции</CardTitle></CardHeader>
            <CardContent>{renderList(useful, "Материалы не найдены")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory">
          <Card>
             <CardHeader><CardTitle>Нормативные документы</CardTitle></CardHeader>
             <CardContent>{renderList(regulatory, "Документы не загружены")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
             <CardHeader><CardTitle>Шаблоны документов</CardTitle></CardHeader>
             <CardContent>{renderList(templates, "Шаблоны не загружены")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}