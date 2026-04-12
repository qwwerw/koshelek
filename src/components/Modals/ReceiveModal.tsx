import { Button, Modal, Section } from "@telegram-apps/telegram-ui";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useOpenConnectModal } from "../../hooks/useOpenConnectModal";

const ReceiveIcon = () => (
  <svg viewBox="0 0 24 24" className="receive-empty-icon-svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const ReceiveModal = () => {
  const closeModal = useAppStore((state) => state.closeModal);
  const isConnected = useAppStore((state) => state.isConnected);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const openConnectModal = useOpenConnectModal();

  const copyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    toast.success("Адрес скопирован");
  };

  return (
    <Modal open onOpenChange={closeModal}>
      <Section header="Получить">
        {!isConnected ? (
          <div className="receive-modal receive-modal--empty">
            <div className="receive-empty-icon" aria-hidden>
              <ReceiveIcon />
            </div>
            <p className="receive-empty-title">Подключите кошелёк</p>
            <p className="receive-empty-hint">Чтобы увидеть адрес и QR для пополнения</p>
            <Button stretched onClick={openConnectModal}>
              Подключить
            </Button>
          </div>
        ) : (
          <div className="receive-modal">
            <p className="receive-modal-hint">Отсканируйте QR или скопируйте адрес</p>
            <div className="receive-qr-card">
              <QRCodeSVG value={walletAddress} size={176} level="M" />
            </div>
            <div className="receive-address-card">
              <span className="receive-address-label">Адрес TON</span>
              <p className="receive-address-value">{walletAddress}</p>
            </div>
            <div className="receive-actions">
              <Button stretched onClick={copyAddress}>
                Копировать
              </Button>
              <Button stretched mode="bezeled" onClick={() => toast("Поделиться скоро будет доступно")}>
                Поделиться
              </Button>
            </div>
          </div>
        )}
      </Section>
    </Modal>
  );
};
