import { Avatar } from "@telegram-apps/telegram-ui";
import { useAppStore } from "../store/useAppStore";
import { formatBalance } from "../utils/formatBalance";
import { useTonConnect } from "../hooks/useTonConnect";
import { hapticFeedbackImpactOccurred, hapticFeedbackSelectionChanged } from "@telegram-apps/sdk";
import toast from "react-hot-toast";

const actions = [
  { id: "send", title: "Перевести", icon: "send" },
  { id: "receive", title: "Пополнить", icon: "receive" },
  { id: "withdraw", title: "Вывести", icon: "withdraw" },
  { id: "exchange", title: "Обменять", icon: "exchange" }
] as const;

const ActionIcon = ({ type }: { type: (typeof actions)[number]["icon"] }) => {
  if (type === "send") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <path d="M21 3L3 10.5l7 2.2L12.2 20 21 3Z" />
      </svg>
    );
  }

  if (type === "receive") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }

  if (type === "withdraw") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16V8M8.5 11.5 12 8l3.5 3.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10h7M15 10l-2-2M16 14H9M9 14l2 2" />
    </svg>
  );
};

export const WalletHeader = () => {
  const balance = useAppStore((state) => state.balance);
  const isConnected = useAppStore((state) => state.isConnected);
  const openModal = useAppStore((state) => state.openModal);
  const { openConnectModal, walletAddress } = useTonConnect();
  const openModalWithFeedback = async (modal: (typeof actions)[number]["id"]) => {
    if (hapticFeedbackSelectionChanged.isAvailable()) hapticFeedbackSelectionChanged();
    if (!isConnected) {
      toast("Сначала подключите кошелёк");
      await openConnectModal();
      return;
    }
    openModal(modal);
  };

  return (
    <header className="wallet-header">
      <div className="wallet-top">
        <button
          className="avatar-button"
          onClick={async () => {
            if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("light");
            await openConnectModal();
          }}
          type="button"
        >
          <Avatar size={48}>
            {walletAddress ? walletAddress.slice(0, 2).toUpperCase() : "W"}
          </Avatar>
        </button>
        <div className="wallet-balance">{formatBalance(balance)}</div>
      </div>

      <div className="wallet-actions">
        {actions.map((item) => (
          <button
            key={item.id}
            className="action-button"
            onClick={() => openModalWithFeedback(item.id)}
            type="button"
          >
            <ActionIcon type={item.icon} />
            <span className="action-title">{item.title}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
