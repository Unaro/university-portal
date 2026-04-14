// src/views/documents/ui/documents-view.tsx
import { DocumentTabs } from "@/widgets/document-tabs/ui/document-tabs";
import { Material } from "@/shared/types/db"; // Строгий тип

interface DocumentsViewProps {
  materials: (Material & { downloadUrl?: string })[];
  isAdmin: boolean;
}

export function DocumentsView({ materials, isAdmin }: DocumentsViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Документы и Материалы</h1>
          <p className="text-muted-foreground">Все необходимые файлы для оформления практики в одном месте.</p>
        </div>
        
        <DocumentTabs materials={materials} isAdmin={isAdmin} />
      </div>
    </div>
  );
}