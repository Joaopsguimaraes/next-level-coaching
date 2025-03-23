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
} from "../ui/card";
import { EmptyList } from "../ui/empty-list";

export function CustomerList() {
  const router = useRouter();
  const { isLoading } = useLoadingAnimations();
  const { deleteCustomer, getCustomersFiltered, customers } =
    useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setCustomerToDelete(null);
    toast.success("Client deleted successfully");
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
            "flex flex-col gap-1",
            isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <CardTitle
            className={cn(
              "transition-all duration-500 delay-100 text-2xl font-bold tracking-tight",
              isLoading
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            )}
          >
            Clients
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
              onClick={() => router.push("/customers/new")}
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
          {customers.length < 1 ? (
            <EmptyList
              message="Não foram encontrados clientes, cadastre um cliente ou selecione novos filtros"
              icon={
                <UserX className="h-20 w-20 text-muted-foreground/40 stroke-[1.25]" />
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {getCustomersFiltered(searchTerm).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Não há clientes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  getCustomersFiltered(searchTerm).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.telephone}</TableCell>
                      <TableCell>
                        {customer.city}, {customer.state}
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
                                router.push(`/customer/${customer.id}`)
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/protocols/new?customerId=${customer.id}`
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
          )}
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
