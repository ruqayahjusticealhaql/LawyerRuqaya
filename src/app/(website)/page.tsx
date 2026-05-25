import ClientHome from "./ClientHome";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cmsData = await getCmsData();
  return <ClientHome cmsData={cmsData} />;
}
