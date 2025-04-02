import { CustomerForm } from "@/components/customer/CustomerForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <CustomerForm
        title="Adicione um novo cliente"
        description="Informe os dados do cliente para realizar o cadastro"
      />
    </div>
  );
}
