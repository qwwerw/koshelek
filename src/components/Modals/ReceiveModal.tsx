import { Button, Modal, Section } from "@telegram-apps/telegram-ui";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useTonConnect } from "../../hooks/useTonConnect";

export const ReceiveModal = () => {
  const closeModal = useAppStore((state) => state.closeModal);
  const isConnected = useAppStore((state) => state.isConnected);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const { openConnectModal, disconnectWallet } = useTonConnect();

  const copyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    toast.success("Адрес скопирован");
  };

  return (
    <Modal open onOpenChange={closeModal}>
      <Section header="Получить">
        {!isConnected ? (
          <div className="placeholder-content">
            <p>Подключите кошелёк</p>
            <Button onClick={openConnectModal}>Подключить</Button>
          </div>
        ) : (
          <div className="receive-content">
            <QRCodeSVG value={walletAddress} size={180} />
            <p className="address-text">{walletAddress}</p>
            <Button stretched onClick={copyAddress}>
              Копировать
            </Button>
            <Button stretched mode="bezeled" onClick={() => toast("Поделиться скоро будет доступно")}>
              Поделиться
            </Button>
            <Button stretched mode="plain" onClick={disconnectWallet}>
              Выйти из кошелька
            </Button>
          </div>
        )}
      </Section>
    </Modal>
  );
};
