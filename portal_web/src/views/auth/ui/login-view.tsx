// src/views/auth/ui/login-view.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/ui/login-form";

export function LoginView() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">Вход в систему</CardTitle>
            <CardDescription>
              Введите свои данные для доступа к личному кабинету
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted p-6 text-center text-sm text-muted-foreground border-t">
            <div>
              Еще нет аккаунта?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}