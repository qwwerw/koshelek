import { Button, Modal, Section } from "@telegram-apps/telegram-ui";
import { useAppStore } from "../../store/useAppStore";
import { useTonConnect } from "../../hooks/useTonConnect";

type AccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AccountModal = ({ open, onOpenChange }: AccountModalProps) => {
  const isConnected = useAppStore((state) => state.isConnected);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const { openConnectModal, disconnectWallet } = useTonConnect();

  const handleDisconnect = async () => {
    await disconnectWallet();
    onOpenChange(false);
  };

  const handleOpenTonConnect = async () => {
    await openConnectModal();
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Section header="Аккаунт">
        <div className="account-modal-ton">
          {!isConnected ? (
            <>
              <p className="account-modal-ton__hint">Подключите кошелёк через TonConnect</p>
              <Button
                stretched
                onClick={() => {
                  void handleOpenTonConnect();
                }}
              >
                Подключить кошелёк
              </Button>
              <Button stretched mode="plain" onClick={() => onOpenChange(false)}>
                Закрыть
              </Button>
            </>
          ) : (
            <>
              <p className="account-modal-ton__address" title={walletAddress}>
                {walletAddress}
              </p>
              <Button
                stretched
                mode="bezeled"
                onClick={() => {
                  void handleOpenTonConnect();
                }}
              >
                Сменить кошелёк
              </Button>
              <Button stretched mode="bezeled" onClick={() => void handleDisconnect()}>
                Выйти из кошелька
              </Button>
              <Button stretched mode="plain" onClick={() => onOpenChange(false)}>
                Закрыть
              </Button>
            </>
          )}
        </div>
      </Section>
    </Modal>
  );
};
