// src/views/auth/ui/register-view.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/ui/register-form";

export function RegisterView() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-2xl shadow-2xl border-t-4 border-t-primary">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-primary">Создание аккаунта</CardTitle>
            <CardDescription className="text-base">
              Выберите вашу роль, чтобы продолжить регистрацию
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="justify-center border-t bg-muted p-6">
             <div className="text-sm text-muted-foreground">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Войти
                </Link>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}