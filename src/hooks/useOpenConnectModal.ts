import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function useOpenConnectModal() {
  const [tonConnectUI] = useTonConnectUI();

  return useCallback(async () => {
    try {
      await tonConnectUI.openModal();
    } catch {
      toast.error("Ошибка подключения кошелька");
    }
  }, [tonConnectUI]);
}
