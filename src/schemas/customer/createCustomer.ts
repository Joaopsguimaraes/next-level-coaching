import { z } from "zod";

export const createCustomerSchema = z.object({
  first_name: z
    .string({
      required_error: "Nome é obrigatório",
      message: "Nome invalido, forneça uma nome valido",
    })
    .min(3, { message: "Nome deve conter pelo menos 3 caracteres" })
    .max(140, { message: "Nome deve ter máximo 140 caracteres" }),
  status: z
    .union([z.literal("ACTIVE"), z.literal("BLOCKED"), z.literal("INACTIVE")])
    .default("ACTIVE")
    .optional(),
  last_name: z
    .string({
      required_error: "Sobrenome é obrigatório",
      message: "Sobrenome invalido, forneça uma Sobrenome valido",
    })
    .min(3, { message: "Sobrenome deve conter pelo menos 3 caracteres" })
    .max(140, { message: "Sobrenome deve ter máximo 140 caracteres" }),
  nick_name: z
    .string({
      required_error: "Apelido é obrigatório",
      message: "Apelido invalido, forneça uma Apelido valido",
    })
    .min(3, { message: "Nome abreviado deve conter pelo menos 3 caracteres" })
    .max(10, { message: "Nome abreviado nome deve ter máximo 140 caracteres" }),
  email: z
    .string({
      required_error: "Email é obrigatório",
      message: "Email invalido, forneça uma Email valido",
    })
    .email({
      message: "Email invalido, forneça uma Email valido",
    }),
  document: z
    .string({
      message: "CPF invalido, forneça uma CPF valido",
    })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .optional(),
  phone: z
    .string({
      message: "Telefone invalido, forneça uma Telefone valido",
    })
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido")
    .optional(),
  address: z
    .string({
      message: "Endereço invalido, forneça uma Endereço valido",
    })
    .optional(),
  city: z
    .string({
      required_error: "Cidade é obrigatória",
      message: "Cidade invalido, forneça uma Cidade valido",
    })
    .min(3, "Cidade inválida"),
  uf: z
    .string({
      required_error: "Estado é obrigatório",
      message: "Estado invalido, forneça uma Estado valido",
    })
    .length(2, "Estado inválido"),
  zip: z
    .string({
      message: "CEP invalido, forneça uma CEP valido",
    })
    .optional(),
  country: z
    .string({
      required_error: "Estado é obrigatório",
      message: "Estado invalido, forneça uma Estado valido",
    })
    .optional(),
  plan_id: z
    .string({
      required_error: "Plano é obrigatório",
      message: "Plano invalido, forneça uma Plano valido",
    })
    .uuid(),
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
