"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Protocol, Meal, Exercise, Supplement, Workout } from "@/types";
import { toast } from "sonner";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { useProtocolStore } from "@/store/useProtocol";
import { useCustomerStore } from "@/store/useCustomer";
import { useLoadingAnimations } from "@/hooks/use-loading-animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const protocolSchema = z.object({
  customerId: z.string().min(1, { message: "Por favor selecione um cliente" }),
  durationDays: z.coerce
    .number()
    .min(1, { message: "Duração do protocolo deve ser valida!" }),
  startDate: z.date({ required_error: "Data de inicio é obrigatória" }),
  endDate: z.date({ required_error: "Data fim é obrigatória" }),
});

type ProtocolFormValues = z.infer<typeof protocolSchema>;

interface ProtocolFormProps {
  title: string;
  description: string;
  protocol?: Protocol;
}

export function ProtocolForm({
  title,
  description,
  protocol,
}: ProtocolFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useLoadingAnimations();
  const { addProtocol, updateProtocol } = useProtocolStore();
  const { customers } = useCustomerStore();

  const [meals, setMeals] = useState<Meal[]>(protocol?.diet?.meals || []);
  const [workouts, setWorkouts] = useState<Workout[]>(protocol?.workouts || []);
  const [supplements, setSupplements] = useState<Supplement[]>(
    protocol?.supplementation || []
  );

  const clientIdParam = searchParams.get("customerId");

  const form = useForm<ProtocolFormValues>({
    resolver: zodResolver(protocolSchema),
    defaultValues: protocol
      ? {
          customerId: protocol.customerId,
          durationDays: protocol.durationDays,
          startDate: new Date(protocol.startDate),
          endDate: new Date(protocol.endDate),
        }
      : {
          customerId: clientIdParam || "",
          durationDays: 30,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
  });

  function updateEndDate(startDate: Date, durationDays: number) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays - 1);
    form.setValue("endDate", endDate);
  }

  // Update endDate when startDate or durationDays changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        (name === "startDate" || name === "durationDays") &&
        value.startDate &&
        value.durationDays
      ) {
        updateEndDate(value.startDate as Date, Number(value.durationDays));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Diet handlers
  const addMeal = () => {
    setMeals([
      ...meals,
      { id: uuidv4(), name: `Meal ${meals.length + 1}`, description: "" },
    ]);
  };

  const updateMeal = (id: string, data: Partial<Meal>) => {
    setMeals(
      meals.map((meal) => (meal.id === id ? { ...meal, ...data } : meal))
    );
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  // Workout handlers
  const addWorkout = () => {
    setWorkouts([
      ...workouts,
      { id: uuidv4(), name: `Workout ${workouts.length + 1}`, exercises: [] },
    ]);
  };

  const updateWorkout = (id: string, data: Partial<Workout>) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === id ? { ...workout, ...data } : workout
      )
    );
  };

  const removeWorkout = (id: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  // Exercise handlers
  const addExercise = (workoutId: string) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: [
              ...workout.exercises,
              { id: uuidv4(), name: "", sets: 3, reps: 12 },
            ],
          };
        }
        return workout;
      })
    );
  };

  const updateExercise = (
    workoutId: string,
    exerciseId: string,
    data: Partial<Exercise>
  ) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) =>
              exercise.id === exerciseId ? { ...exercise, ...data } : exercise
            ),
          };
        }
        return workout;
      })
    );
  };

  const removeExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(
      workouts.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.filter(
              (exercise) => exercise.id !== exerciseId
            ),
          };
        }
        return workout;
      })
    );
  };

  // Supplement handlers
  const addSupplement = () => {
    setSupplements([
      ...supplements,
      { id: uuidv4(), name: "", dosage: "", frequency: "" },
    ]);
  };

  const updateSupplement = (id: string, data: Partial<Supplement>) => {
    setSupplements(
      supplements.map((supplement) =>
        supplement.id === id ? { ...supplement, ...data } : supplement
      )
    );
  };

  const removeSupplement = (id: string) => {
    setSupplements(supplements.filter((supplement) => supplement.id !== id));
  };

  function onSubmit(data: ProtocolFormValues) {
    if (meals.length === 0) {
      toast.error("Por favor adicione dieta ao plano!");
      return;
    }

    if (workouts.length === 0) {
      toast.error("Por favor adicione treino ao plano!");
      return;
    }

    const protocolData = {
      customerId: data.customerId,
      durationDays: data.durationDays,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      diet: { id: uuidv4(), meals },
      workouts,
      supplementation: supplements,
    };

    if (protocol) {
      updateProtocol(protocol.id, protocolData);
      toast.success("Protocol updated successfully");
    } else {
      addProtocol(protocolData);
      toast.success("Protocol created successfully");
    }

    router.push("/protocol");
  }

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.first_name} {customer.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (dias)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs defaultValue="diet" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diet">Plano alimentar</TabsTrigger>
                <TabsTrigger value="workouts">Plano de treinos</TabsTrigger>
                <TabsTrigger value="supplements">Suplementos</TabsTrigger>
              </TabsList>

              {/* Diet Tab */}
              <TabsContent value="diet" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Plano alimentar</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMeal}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar alimento
                  </Button>
                </div>

                {meals.length === 0 ? (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">
                      Nenhum alimento foi adicionado ainda
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addMeal}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar alimento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meals.map((meal, index) => (
                      <div
                        key={meal.id}
                        className="border rounded-md p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Alimento {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-sm font-medium">Nome</label>
                            <Input
                              value={meal.name}
                              onChange={(e) =>
                                updateMeal(meal.id, { name: e.target.value })
                              }
                              placeholder="Breakfast, Lunch, etc."
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">
                              Descrição
                            </label>
                            <Textarea
                              value={meal.description}
                              onChange={(e) =>
                                updateMeal(meal.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="E.g., 200g rice, 150g chicken breast, mixed vegetables"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Workouts Tab */}
              <TabsContent value="workouts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Plano de treinos</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWorkout}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar treino
                  </Button>
                </div>

                {workouts.length === 0 ? (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">
                      Nenhum treino adicionado ainda
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addWorkout}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar treino
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workouts.map((workout, index) => (
                      <div
                        key={workout.id}
                        className="border rounded-md p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Treino {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWorkout(workout.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Nome</label>
                          <Input
                            value={workout.name}
                            onChange={(e) =>
                              updateWorkout(workout.id, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Chest Day, Leg Day, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">Exercícios</h5>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addExercise(workout.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar exercício
                            </Button>
                          </div>

                          {workout.exercises.length === 0 ? (
                            <div className="text-center p-4 border rounded-md bg-muted/50">
                              <p className="text-sm text-muted-foreground">
                                Nenhum exercício adicionado ainda
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {workout.exercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className="border rounded-md p-3 grid grid-cols-1 sm:grid-cols-5 gap-3"
                                >
                                  <div className="sm:col-span-2">
                                    <label className="text-xs font-medium">
                                      Exercício
                                    </label>
                                    <Input
                                      value={exercise.name}
                                      onChange={(e) =>
                                        updateExercise(
                                          workout.id,
                                          exercise.id,
                                          {
                                            name: e.target.value,
                                          }
                                        )
                                      }
                                      placeholder="Bench Press, Squats, etc."
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs font-medium">
                                      Series
                                    </label>
                                    <Input
                                      type="number"
                                      value={exercise.sets}
                                      onChange={(e) =>
                                        updateExercise(
                                          workout.id,
                                          exercise.id,
                                          {
                                            sets: parseInt(e.target.value),
                                          }
                                        )
                                      }
                                      min={1}
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs font-medium">
                                      Repetições
                                    </label>
                                    <Input
                                      type="number"
                                      value={exercise.reps}
                                      onChange={(e) =>
                                        updateExercise(
                                          workout.id,
                                          exercise.id,
                                          {
                                            reps: parseInt(e.target.value),
                                          }
                                        )
                                      }
                                      min={1}
                                    />
                                  </div>

                                  <div className="flex items-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeExercise(workout.id, exercise.id)
                                      }
                                      className="ml-auto"
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Supplements Tab */}
              <TabsContent value="supplements" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Suplementação</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSupplement}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar suplementação
                  </Button>
                </div>

                {supplements.length === 0 ? (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">
                      Nenhuma suplementação adicionada
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addSupplement}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar suplementação
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supplements.map((supplement) => (
                      <div
                        key={supplement.id}
                        className="border rounded-md p-4 grid grid-cols-1 sm:grid-cols-4 gap-4"
                      >
                        <div>
                          <label className="text-sm font-medium">Nome</label>
                          <Input
                            value={supplement.name}
                            onChange={(e) =>
                              updateSupplement(supplement.id, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Whey Protein, Creatine, etc."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Quantidade
                          </label>
                          <Input
                            value={supplement.dosage}
                            onChange={(e) =>
                              updateSupplement(supplement.id, {
                                dosage: e.target.value,
                              })
                            }
                            placeholder="30g, 5g, etc."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Frequência
                          </label>
                          <Input
                            value={supplement.frequency}
                            onChange={(e) =>
                              updateSupplement(supplement.id, {
                                frequency: e.target.value,
                              })
                            }
                            placeholder="Twice daily, After workout, etc."
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSupplement(supplement.id)}
                            className="ml-auto"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                className="min-w-32"
                onClick={() => router.push("/protocol")}
              >
                Cancelar
              </Button>
              <Button className="min-w-32" type="submit">
                {protocol ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
