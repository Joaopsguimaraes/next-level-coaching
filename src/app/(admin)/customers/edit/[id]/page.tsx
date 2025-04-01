import { CustomerForm } from "@/components/customer/CustomerForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <CustomerForm
        title="Edição do cliente"
        description="Edite os dados do cliente já registrado"
        customerId={id}
      />
    </div>
  );
}
