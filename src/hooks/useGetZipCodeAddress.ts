import { brasilApi } from "@/lib/axios";
import { useState } from "react";
import { AddressWithZipCode } from "@/types/AddressFromZipCode";

export const useGetZipCodeAddress = () => {
  const [address, setAddress] = useState<AddressWithZipCode | null>(null);

  async function getAddressWithZipCode(
    zipCode: number | string
  ): Promise<void> {
    let value = zipCode;

    if (typeof zipCode === "string") {
      value = zipCode.replace(/\D/g, "");
    }

    const { data } = await brasilApi.get<AddressWithZipCode>(`cep/v2/${value}`);

    setAddress(data);
  }

  return {
    address,
    getAddressWithZipCode,
  };
};
