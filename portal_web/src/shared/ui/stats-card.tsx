import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  color?: string;
}

export function StatsCard({ icon, label, value, color = "text-foreground" }: StatsCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 flex items-center gap-4">
      <div className={`p-2 rounded-full bg-muted ${color}`}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
