import { HomePage } from "@/components/HomePage";
import { getContent } from "@/lib/content-store";

export default async function Page() {
  const content = await getContent();
  return <HomePage content={content} />;
}
