import Portal from "@/features/portal/app";

export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <Portal initialPath={`/${slug.join("/")}`} />;
}
