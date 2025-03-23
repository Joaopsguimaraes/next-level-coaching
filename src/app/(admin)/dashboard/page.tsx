import { Dashboard } from "@/components/dashboard";
import { fakeFetch } from "@/utils/fake-fetch";

export default async function Page() {
  await fakeFetch();

  return <Dashboard />;
}
