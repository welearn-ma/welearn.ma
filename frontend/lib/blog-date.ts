export function formatArticleDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
