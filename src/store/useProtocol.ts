import { create } from "zustand";
import { Protocol } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { isAfter } from "date-fns";

interface ProtocolStore {
  protocols: Protocol[];
  addProtocol: (protocol: Omit<Protocol, "id" | "createdAt">) => void;
  updateProtocol: (id: Protocol["id"], protocol: Partial<Protocol>) => void;
  deleteProtocol: (id: Protocol["id"]) => void;
  getProtocol: (id: Protocol["id"]) => Protocol | undefined;
  getActiveProtocols: () => Protocol[];
  getExpiredProtocols: () => Protocol[];
  getRecentProtocols: () => Protocol[];
  markProtocolSent: (id: string) => void;
}

export const useProtocolStore = create<ProtocolStore>()((set, get) => ({
  protocols: [],
  addProtocol: (protocol) =>
    set((state) => ({
      protocols: [
        ...state.protocols,
        {
          ...protocol,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateProtocol: (id, protocol) =>
    set((state) => ({
      protocols: state.protocols.map((p) =>
        p.id === id ? { ...p, ...protocol } : p
      ),
    })),
  deleteProtocol: (id) =>
    set((state) => ({
      protocols: state.protocols.filter((protocol) => protocol.id !== id),
    })),
  getProtocol: (id) => {
    const protocol = get().protocols.find((protocol) => protocol.id === id);
    if (protocol) {
      return { ...protocol };
    }
    return undefined;
  },
  markProtocolSent: (id) =>
    set((state) => ({
      protocols: state.protocols.map((p) =>
        p.id === id ? { ...p, sentAt: new Date().toISOString() } : p
      ),
    })),
  getActiveProtocols: () =>
    get().protocols.filter((protocol) =>
      isAfter(new Date(protocol.endDate), new Date())
    ),
  getExpiredProtocols: () =>
    get().protocols.filter(
      (protocol) => !isAfter(new Date(protocol.endDate), new Date())
    ),
  getRecentProtocols: () =>
    get()
      .protocols.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
}));
