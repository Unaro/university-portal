// src/entities/session/ui/profile-sidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Mail, Phone, GraduationCap, Building2 } from "lucide-react";
import { LogoutButton } from "@/features/auth/ui/logout-button";
import type { SessionUser } from "@/views/profile/ui/profile-view";

interface ProfileSidebarProps {
  user: SessionUser;
  details?: {
    group?: string | null;
    phone?: string | null;
    position?: string | null;
  };
}

export function ProfileSidebar({ user, details }: ProfileSidebarProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="shadow-md border-t-4 border-t-primary text-center h-fit">
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 border-4 border-card shadow-sm overflow-hidden">
          <Avatar className="w-full h-full">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-2xl font-bold text-primary bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
        
        <div className="mt-2 mb-4">
          <Badge variant="secondary" className="px-3 py-1">
            {user.role === "student" ? "Студент" : 
             user.role === "organization_representative" ? "Партнер" : "Сотрудник"}
          </Badge>
        </div>

        <div className="w-full space-y-3 text-left text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> {user.email}
          </div>
          
          {details?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {details.phone}
            </div>
          )}

          {user.role === "student" && details?.group && (
            <div className="flex items-center gap-2 text-foreground font-medium">
              <GraduationCap className="h-4 w-4" /> {details.group}
            </div>
          )}
          
          {user.role === "organization_representative" && (
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Building2 className="h-4 w-4" /> Представитель
            </div>
          )}
        </div>

        <div className="w-full mt-6">
           <LogoutButton />
        </div>
      </CardContent>
    </Card>
  );
}