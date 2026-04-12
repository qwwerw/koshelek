import { Button, Modal, Section } from "@telegram-apps/telegram-ui";
import { useTonConnectUI } from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";

export const LogoutModal = () => {
  const closeModal = useAppStore((state) => state.closeModal);
  const [tonConnectUI] = useTonConnectUI();

  const handleLogout = async () => {
    try {
      await tonConnectUI.disconnect();
      toast.success("Кошелёк отключён");
      closeModal();
    } catch {
      toast.error("Ошибка отключения кошелька");
    }
  };

  return (
    <Modal open onOpenChange={closeModal}>
      <Section header="Аккаунт">
        <div className="logout-modal">
          <p className="logout-modal-text">Выйти из аккаунта?</p>
          <Button stretched onClick={() => void handleLogout()}>
            Выйти
          </Button>
          <Button stretched mode="bezeled" onClick={closeModal} type="button">
            Отмена
          </Button>
        </div>
      </Section>
    </Modal>
  );
};
