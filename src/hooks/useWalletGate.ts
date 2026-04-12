import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { hapticFeedbackSelectionChanged } from "@telegram-apps/sdk";
import { useAppStore } from "../store/useAppStore";
import type { ModalType } from "../store/useAppStore";

/**
 * Для кнопок действий: если кошелёк не подключён — тост и TonConnect; после закрытия модалки
 * открывает целевую модалку приложения только если подключение появилось.
 */
export function useWalletGate() {
  const [tonConnectUI] = useTonConnectUI();
  const openModal = useAppStore((s) => s.openModal);

  return useCallback(
    async (modal: ModalType) => {
      if (hapticFeedbackSelectionChanged.isAvailable()) hapticFeedbackSelectionChanged();

      if (!useAppStore.getState().isConnected) {
        toast("Сначала подключите кошелёк");
        try {
          await tonConnectUI.openModal();
        } catch {
          toast.error("Ошибка подключения кошелька");
        }
      }

      if (!useAppStore.getState().isConnected) return;
      openModal(modal);
    },
    [openModal, tonConnectUI]
  );
}
