"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  ClipboardList,
  Clock,
  Plus,
  ClipboardCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/store/useCustomer";
import { useProtocolStore } from "@/store/useProtocol";
import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { DashboardTitle } from "./DashboardTitle";
import { cn } from "@/lib/utils";
import { EmptyList } from "../ui/empty-list";

export function Dashboard() {
  const router = useRouter();
  const { isLoading } = useLoadingAnimations();
  const { customers } = useCustomerStore();
  const { getActiveProtocols, getExpiredProtocols, getRecentProtocols } =
    useProtocolStore();

  const customersMap = customers.reduce((acc, customer) => {
    acc[customer.id] = `${customer.first_name} ${customer.last_name}`;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      <DashboardTitle />

      <div
        className={cn(
          "grid gap-4 md:grid-cols-3 transform transition-all duration-500 delay-200",
          isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-primary">
              Total de clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {customers.length === 0
                ? "Não há clientes registrados"
                : "Total de clientes registrados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-primary">
              Protocolos ativos
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getActiveProtocols().length}
            </div>
            <p className="text-xs text-muted-foreground">
              {getActiveProtocols().length === 0
                ? "Não há protocolos ativos"
                : "Protocolos em andamento"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-primary">
              Protocolos expirados
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getExpiredProtocols.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {getExpiredProtocols.length === 0
                ? "Não há protocolos expirados"
                : "Protocolos encerrados"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        className={cn(
          "grid gap-4 md:grid-cols-2 transform transition-all duration-500 delay-300",
          isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-medium text-primary">
              Atividades recentes
            </CardTitle>
            <CardDescription>Últimos 5 protocolos criados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentProtocols().length === 0 ? (
                <EmptyList
                  message="Não há atividades recentes, registre um protocolo ou novo cliente"
                  icon={
                    <ClipboardCheck className="h-20 w-20 text-muted-foreground/40 stroke-[1.25]" />
                  }
                />
              ) : (
                getRecentProtocols().map((protocol) => (
                  <div
                    key={protocol.id}
                    className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {customersMap[protocol.customerId] || "Unknown Client"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {protocol.durationDays} Dia do protocolo - Criado em:{" "}
                        {format(new Date(protocol.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/protocol/${protocol.id}`)}
                    >
                      Visualizar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-medium text-primary">
              Ações rápidas
            </CardTitle>
            <CardDescription>
              Ações comuns que você pode realizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => router.push("/customer")}
              >
                <Users className="mr-2 h-4 w-4" />
                Ver todos clientes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => router.push("/protocol")}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Ver todos protocolos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => router.push("/customer/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar novo cliente
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => router.push("/protocol/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar novo protocolo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
