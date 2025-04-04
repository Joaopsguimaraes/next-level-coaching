/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  ClipboardList,
  UserX,
  UsersIcon,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/store/useCustomer";
import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyList } from "@/components/ui/empty-list";
import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types/customer-status";

export function CustomerList() {
  const router = useRouter();
  const { isLoading } = useLoadingAnimations();
  const { deleteCustomer, getCustomersFiltered } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setCustomerToDelete(null);
    toast.success("Cliente deletado com sucesso");
  };

  const statusLabel: Record<CustomerStatus, string> = {
    ACTIVE: "Ativo",
    BLOCKED: "Bloqueado",
    INACTIVE: "Inativo",
  };

  const statusVariant: Record<CustomerStatus, string> = {
    ACTIVE: "default",
    BLOCKED: "destructive",
    INACTIVE: "secondary",
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
            <UsersIcon />
            Clientes
          </CardTitle>
          <CardDescription
            className={cn(
              "text-muted-foreground transform transition-all duration-500 delay-100",
              isLoading
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            Gerencie os clientes cadastrados no sistema
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
                placeholder="Pesquise os clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => router.push("/customer/new")}
              className="transition-all hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar cliente
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
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Endereço</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCustomersFiltered(searchTerm).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <EmptyList
                      message="Não foram encontrados clientes"
                      icon={
                        <UserX className="h-20 w-20 text-muted-foreground/40 stroke-[1.25]" />
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                getCustomersFiltered(searchTerm).map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      {customer.first_name} {customer.last_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusVariant[customer.status] as any}>
                        {statusLabel[customer.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {customer.city}, {customer.uf}
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
                              router.push(`/customer/edit/${customer.id}`)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/protocol/new?customerId=${customer.id}`
                              )
                            }
                          >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Criar Protocolo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setCustomerToDelete(customer.id)}
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
        open={!!customerToDelete}
        onOpenChange={() => setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Voce tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita, ela irá deletar o cliente e todos
              os protocolos associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => customerToDelete && handleDelete(customerToDelete)}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
