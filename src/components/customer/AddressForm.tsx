"use client";

import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CreateCustomer } from "@/schemas/customer/createCustomer";

type State = {
  sigla: string;
  nome: string;
};

type City = {
  nome: string;
};

interface Props {
  form: UseFormReturn<CreateCustomer>;
}

export function AddressForm({ form }: Props) {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await axios.get(
          "https://brasilapi.com.br/api/ibge/uf/v1"
        );
        const sortedStates = response.data.sort((a: State, b: State) =>
          a.nome.localeCompare(b.nome)
        );
        setStates([...sortedStates, { sigla: "OT", nome: "Outros" }]);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const uf = form.watch("uf");
    const loadCities = async () => {
      if (uf && uf !== "OT") {
        setLoadingCities(true);
        try {
          const response = await axios.get(
            `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`
          );
          const sortedCities = response.data.sort((a: City, b: City) =>
            a.nome.localeCompare(b.nome)
          );
          setCities([...sortedCities, { nome: "Outros" }]);
        } finally {
          setLoadingCities(false);
        }
      }
    };
    loadCities();
  }, [form]);

  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: R. 21 N. 21" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="uf"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Estado</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={loadingStates}
                  >
                    {field.value
                      ? states.find((state) => state.sigla === field.value)
                          ?.nome
                      : "Selecione um estado"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar estado..." />
                  <CommandList>
                    <CommandEmpty>Nenhum estado encontrado</CommandEmpty>
                    <CommandGroup>
                      {states.map((state) => (
                        <CommandItem
                          value={state.nome}
                          key={state.sigla}
                          onSelect={() => {
                            form.setValue("uf", state.sigla);
                            form.setValue("city", "");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2",
                              state.sigla === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {state.nome} ({state.sigla})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Cidade</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={!form.watch("uf") || loadingCities}
                  >
                    {field.value || "Selecione uma cidade"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar cidade..." />
                  <CommandList>
                    {loadingCities ? (
                      <CommandEmpty>Carregando cidades...</CommandEmpty>
                    ) : (
                      <>
                        <CommandEmpty>Nenhuma cidade encontrada</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              value={city.nome}
                              key={city.nome}
                              onSelect={() => form.setValue("city", city.nome)}
                            >
                              <Check
                                className={cn(
                                  "mr-2",
                                  city.nome === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pais</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Brasil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
