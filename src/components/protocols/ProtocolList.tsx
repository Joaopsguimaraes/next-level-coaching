"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ClipboardListIcon,
  Edit,
  FileText,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { generatePDF } from "@/lib/pdf-generator";
import { useRouter } from "next/navigation";
import { useProtocolStore } from "@/store/useProtocol";
import { useCustomerStore } from "@/store/useCustomer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { EmptyList } from "../ui/empty-list";

export function ProtocolsList() {
  const router = useRouter();
  const { isLoading } = useLoadingAnimations();
  const { protocols, deleteProtocol, getProtocol, markProtocolSent } =
    useProtocolStore();
  const { customers } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [protocolToDelete, setProtocolToDelete] = useState<string | null>(null);

  // Add client names to protocols
  const protocolsWithClients = protocols.map((protocol) => {
    const client = customers.find((c) => c.id === protocol.customerId);
    return {
      ...protocol,
      clientName: client
        ? `${client.first_name} ${client.last_name}`
        : "Cliente desconhecido",
    };
  });

  const filteredProtocols = protocolsWithClients.filter((protocol) =>
    protocol.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteProtocol(id);
    setProtocolToDelete(null);
    toast.success("Protocolo removido com sucesso!");
  };

  const handleGeneratePDF = async (protocolId: string) => {
    try {
      const protocol = getProtocol(protocolId);
      if (!protocol) {
        toast.error("Protocolo não encontrado");
        return;
      }

      await generatePDF(protocol);
      markProtocolSent(protocolId);
      toast.success("PDF do protocolo gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Falha ao gerar PDF!");
    }
  };

  return (
    <>
      <Card
        className={cn(
          "flex flex-col space-y-4 transform transition-all duration-500 delay-100",
          isLoading ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <CardHeader
          className={cn(
            "flex flex-col gap-2",
            isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <CardTitle
            className={cn(
              "transition-all text-primary inline-flex items-center gap-1 duration-500 delay-100 text-2xl font-bold tracking-tight",
              isLoading
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            <ClipboardListIcon />
            Protocolos
          </CardTitle>
          <CardDescription
            className={cn(
              "text-muted-foreground transform transition-all duration-500 delay-100",
              isLoading
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            Gerencie os protocolos cadastrados no sistema
          </CardDescription>
          <div
            className={cn(
              "flex w-full justify-between items-center transform transition-all duration-500 delay-200",
              isLoading
                ? "translate-y-8 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Pesquisar protocolos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => router.push("/protocol/new")}
              className="transition-all hover:shadow-md"
            >
              <Plus className="size-4 mr-2" />
              Novo protocolo
            </Button>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "transform transition-all duration-500 delay-300",
            isLoading ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de inicio</TableHead>
                <TableHead>Data fim</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProtocols.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32">
                    <EmptyList
                      message="Não foram encontrados protocolos"
                      icon={
                        <ClipboardListIcon className="h-20 w-20 text-muted-foreground/40 stroke-[1.25]" />
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProtocols.map((protocol) => (
                  <TableRow key={protocol.id}>
                    <TableCell className="font-medium">
                      {protocol.clientName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(protocol.startDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(protocol.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{protocol.durationDays} days</TableCell>
                    <TableCell>
                      {protocol.sentAt ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Enviado em{" "}
                          {format(new Date(protocol.sentAt), "MMM d")}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/protocol/${protocol.id}`)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGeneratePDF(protocol.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Gerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setProtocolToDelete(protocol.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog
        open={!!protocolToDelete}
        onOpenChange={() => setProtocolToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Vai remover permanente esse
              protocolo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => protocolToDelete && handleDelete(protocolToDelete)}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
