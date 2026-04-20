export function formatDate(date: Date | string | null | undefined): string {
  if (typeof date === "string") date = new Date(date);
  if (!date) return "Дата неизвестна";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}
