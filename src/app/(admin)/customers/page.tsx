import { CustomerList } from "@/components/customer/CustomerList";
import { fakeFetch } from "@/utils/fake-fetch";

export default async function Page() {
  await fakeFetch();

  return (
    <div className="space-y-4">
      <CustomerList />
    </div>
  );
}
