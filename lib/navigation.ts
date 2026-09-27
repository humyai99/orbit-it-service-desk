export type Page = "dashboard" | "tickets" | "ticket" | "assets" | "asset" | "inventory" | "software" | "users" | "knowledge" | "reports";
export type Route = { page: Page; id?: string };

const sections = new Set<Page>(["tickets", "assets", "inventory", "software", "users", "knowledge", "reports"]);

export function parseRoute(pathname: string): Route {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "tickets" && parts[1]) return { page: "ticket", id: parts[1] };
  if (parts[0] === "assets" && parts[1]) return { page: "asset", id: parts[1] };
  if (sections.has(parts[0] as Page)) return { page: parts[0] as Page };
  return { page: "dashboard" };
}

export function routePath(route: Route): string {
  if (route.page === "dashboard") return "/";
  if (route.page === "ticket") return `/tickets/${encodeURIComponent(route.id ?? "")}`;
  if (route.page === "asset") return `/assets/${encodeURIComponent(route.id ?? "")}`;
  return `/${route.page}`;
}
