import { Button, Input, Modal, Section } from "@telegram-apps/telegram-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useAppStore } from "../../store/useAppStore";
import { createSendSchema } from "../../utils/tonValidation";

type SendFormValues = {
  address: string;
  amount: number;
};

export const SendModal = () => {
  const [tonConnectUI] = useTonConnectUI();
  const closeModal = useAppStore((state) => state.closeModal);
  const balanceRub = useAppStore((state) => state.balance);
  const maxTonAmount = balanceRub / 270;
  const schema = createSendSchema(maxTonAmount);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SendFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { address: "", amount: 0 }
  });

  const onSubmit = async (values: SendFormValues) => {
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: values.address,
            amount: String(Math.floor(values.amount * 1e9))
          }
        ]
      });
      toast.success("Транзакция отправлена");
      closeModal();
    } catch {
      toast.error("Ошибка транзакции");
    }
  };

  const onInvalid = (valuesErrors: typeof errors) => {
    const message = valuesErrors.amount?.message ?? valuesErrors.address?.message;
    if (message) toast.error(message);
  };

  return (
    <Modal open onOpenChange={closeModal}>
      <Section header="Перевод">
        <form className="modal-form" onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <Input placeholder="TON адрес" {...register("address")} />
          {errors.address && <p className="field-error">{errors.address.message}</p>}

          <Input
            type="number"
            step="0.0001"
            placeholder="Сумма TON"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && <p className="field-error">{errors.amount.message}</p>}

          <Button stretched type="submit">
            Отправить
          </Button>
          <Button stretched mode="bezeled" onClick={closeModal} type="button">
            Отмена
          </Button>
        </form>
      </Section>
    </Modal>
  );
};
