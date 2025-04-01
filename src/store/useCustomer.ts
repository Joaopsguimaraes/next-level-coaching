import { Customer, Protocol } from "@/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useProtocolStore } from "./useProtocol";
import { CreateCustomer } from "@/schemas/customer/createCustomer";
import { persist, createJSONStorage } from "zustand/middleware";

interface CustomerStore {
  customers: Customer[];
  addCustomer: (client: CreateCustomer) => void;
  updateCustomer: (id: Customer["id"], client: Partial<Customer>) => void;
  deleteCustomer: (id: Customer["id"]) => void;
  getCustomer: (id: Customer["id"]) => Customer | undefined;
  getCustomerProtocols: (clientId: Customer["id"]) => Protocol[];
  getCustomersFiltered: (searchTerm: string) => Customer[];
}

const protocols = useProtocolStore.getState().protocols;

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      addCustomer: (newCustomer) =>
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...newCustomer,
              id: uuidv4(),
              status: newCustomer.status ? newCustomer.status : "ACTIVE",
            },
          ],
        })),
      updateCustomer: (id, client) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...client } : c
          ),
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((client) => client.id !== id),
        })),
      getCustomer: (id) => get().customers.find((client) => client.id === id),
      getCustomerProtocols: (clientId) => {
        const customerProtocols = protocols.filter(
          (protocol) => protocol.clientId === clientId
        );
        return customerProtocols;
      },
      getCustomersFiltered: (searchTerm) =>
        get().customers.filter(
          (client) =>
            client.first_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            client.last_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }),
    {
      name: "customer-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
