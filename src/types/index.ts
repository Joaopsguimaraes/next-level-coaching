import { CustomerStatus } from "./customer-status";

export interface Customer {
  id: string;
  first_name: string;
  last_name?: string;
  nickname?: string;
  email: string;
  document?: string;
  phone?: string;
  address?: string;
  city: string;
  uf: string;
  zip?: string;
  country?: string;
  status: CustomerStatus;
  anamnese_id?: string;
  plan_id?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Diet {
  id: string;
  meals: Meal[];
}

export interface Protocol {
  id: string;
  clientId: string;
  client?: Customer;
  diet: Diet;
  workouts: Workout[];
  supplementation: Supplement[];
  startDate: string;
  endDate: string;
  durationDays: number;
  createdAt: string;
  sentAt?: string;
}
