import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface StatsCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  className?: string; 
}

function StatBadge({ icon, label, value, color = "text-foreground" }: StatsCardProps) {
  return (
    <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
      {icon && <div className={`p-2 rounded-full bg-muted ${color}`}>{icon}</div>}
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}


export function StatsCard({ icon, label, value, color = "text-foreground", className = "", variant = 'default' }: StatsCardProps & {variant?: 'mini' | 'default'}) {

  const displayValue = String(value); 
    
  if (variant === 'mini') {
    return <StatBadge icon={icon} label={label} value={value} color={color} />
  }
  
  return (
  <Card className={cn("flex flex-col h-full", className)}>
    <CardHeader className="pb-3 pt-4">
      <div className="flex items-start gap-3">
          {icon && <div className={`p-3 rounded-full bg-muted ${color}/80 flex-shrink-0`}>
            {icon}
          </div>}

          <CardTitle className={`text-base text-muted-foreground ${color}`}>{label}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className={`text-3xl font-bold ${color}`}>{displayValue}</div>
    </CardContent>
  </Card>
  );
}