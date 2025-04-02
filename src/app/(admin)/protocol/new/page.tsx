import { ProtocolForm } from "@/components/protocols/ProtocolForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <ProtocolForm
        title="Criar novo protocolo"
        description="Informe os dados para criação de um novo protocolo"
      />
    </div>
  );
}
