import { brasilApi } from "@/lib/axios";
import { useState } from "react";

type State = {
  sigla: string;
  nome: string;
};

type City = {
  nome: string;
  codigo_ibge: string;
};

export const useAddress = () => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLoadStates() {
    try {
      setIsLoading(true);
      const { data } = await brasilApi.get<State[]>("ibge/uf/v1");

      const sortedStates = data.sort((a: State, b: State) =>
        a.nome.localeCompare(b.nome)
      );

      setStates([...sortedStates, { sigla: "OT", nome: "Outros" }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadCitiesFromState(state: string) {
    try {
      setIsLoading(true);

      const { data } = await brasilApi.get<City[]>(
        `ibge/municipios/v1/${state}`
      );

      setCities([...data, { nome: "Outros", codigo_ibge: "000" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    states,
    cities,
    isLoading,
    handleLoadStates,
    handleLoadCitiesFromState,
  };
};
