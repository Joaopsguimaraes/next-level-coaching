"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import { cn } from "@/lib/utils";
import {
  CreateCustomer,
  createCustomerSchema,
} from "@/schemas/customer/createCustomer";
import { useCustomerStore } from "@/store/useCustomer";
import { applyPhoneMask } from "@/utils/apply-phone-mask";
import { applyCPFMask } from "@/utils/apply-cpf-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressForm } from "./AddressForm";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { ImagePicker } from "../ui/image-picker";

interface CustomerFormProps {
  title: string;
  description: string;
  customerId?: string;
  onSuccess?: () => void;
}

export function CustomerForm({
  title,
  description,
  customerId,
  onSuccess,
}: CustomerFormProps) {
  const router = useRouter();
  const { addCustomer, updateCustomer, getCustomer } = useCustomerStore();
  const { isLoading } = useLoadingAnimations();
  const [multipleImages, setMultipleImages] = useState<File[]>([]);

  const form = useForm<CreateCustomer>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: customerId
      ? getCustomer(customerId)
      : {
          first_name: "",
          last_name: "",
          nick_name: "",
          document: "",
          plan_id: uuidv4(),
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          status: "ACTIVE",
        },
  });

  function onSubmit(data: CreateCustomer) {
    if (customerId) {
      updateCustomer(customerId, data);

      toast.success("Cliente atualizado com sucesso");
    } else {
      console.log(data);
      addCustomer(data);

      toast.success("Cliente adicionado com sucesso");
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/customer");
    }
  }

  const handleMultipleImageSelect = (files: File[]) => {
    setMultipleImages(files);
  };
  return (
    <Card
      className={cn(
        "transform transition-all duration-500 delay-200",
        isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-col gap-2 transform transition-all duration-500 delay-100",
          isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <CardTitle
          className={cn(
            "text-2xl font-bold tracking-tight transform transition-all duration-500 delay-100",
            isLoading ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <strong>Informações gerais</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nick_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome abreviado</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: John doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={applyCPFMask(field.value)}
                        onChange={(e) =>
                          field.onChange(applyCPFMask(e.target.value))
                        }
                        placeholder="Ex.: 00.000.000-00"
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ex.: john.doe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={applyPhoneMask(field.value)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const maskedValue = applyPhoneMask(rawValue);
                          field.onChange(maskedValue);
                        }}
                        placeholder="Ex.: (XX) XXXXX-XXXX"
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AddressForm form={form} />
            </div>

            <div className="flex flex-col gap-5">
              <strong>Imagens</strong>
              <ImagePicker
                onImageSelect={handleMultipleImageSelect}
                multiple={true}
              />
              {multipleImages.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">
                    Selected Images ({multipleImages.length}):
                  </p>
                  <ul className="mt-2 space-y-1">
                    {multipleImages.map((file, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                className="min-w-32"
                onClick={() => router.push("/customer")}
              >
                Cancelar
              </Button>
              <Button className="min-w-32" type="submit">
                {customerId ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
