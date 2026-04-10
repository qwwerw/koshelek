import { z } from "zod";

export const createSendSchema = (maxTonAmount: number) =>
  z.object({
    address: z
      .string()
      .min(48, "Введите корректный TON-адрес")
      .regex(/^[A-Za-z0-9_-]+$/, "Неверный формат TON-адреса"),
    amount: z
      .number({ invalid_type_error: "Введите сумму" })
      .positive("Сумма должна быть больше 0")
      .max(maxTonAmount, "Недостаточно средств")
  });

export type SendSchema = ReturnType<typeof createSendSchema>;
