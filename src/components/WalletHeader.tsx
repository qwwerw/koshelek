import { useState } from "react";
import { Avatar } from "@telegram-apps/telegram-ui";
import toast from "react-hot-toast";
import { hapticFeedbackImpactOccurred, hapticFeedbackSelectionChanged } from "@telegram-apps/sdk";
import { useAppStore } from "../store/useAppStore";
import { useTonConnect } from "../hooks/useTonConnect";
import { formatBalance } from "../utils/formatBalance";
import { AccountModal } from "./Modals/AccountModal";

const actions = [
  { id: "send" as const, title: "Перевести", icon: "send" },
  { id: "receive" as const, title: "Пополнить", icon: "receive" },
  { id: "withdraw" as const, title: "Вывести", icon: "withdraw" },
  { id: "exchange" as const, title: "Обменять", icon: "exchange" }
];

const ActionIcon = ({ type }: { type: (typeof actions)[number]["icon"] }) => {
  const cls = "action-icon-svg";
  if (type === "send") {
    return (
      <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
        <path d="M12 19V5M12 5l-4 4M12 5l4 4" />
      </svg>
    );
  }
  if (type === "receive") {
    return (
      <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
        <path d="M12 5v14M12 19l-4-4M12 19l4-4" />
      </svg>
    );
  }
  if (type === "withdraw") {
    return (
      <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
        <path d="M12 4v10M8 8l4-4 4 4M5 20h14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
      <path d="M8 7V3M8 3L5 6M8 3l3 3" />
      <path d="M16 17v4M16 21l3-3M16 21l-3-3" />
      <path d="M7 12h10" />
    </svg>
  );
};

export const WalletHeader = () => {
  const balance = useAppStore((state) => state.balance);
  const isConnected = useAppStore((state) => state.isConnected);
  const openModal = useAppStore((state) => state.openModal);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const { openConnectModal } = useTonConnect();
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const onAvatarClick = () => {
    if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("light");
    setAccountModalOpen(true);
  };

  const onAction = (id: (typeof actions)[number]["id"]) => {
    if (hapticFeedbackSelectionChanged.isAvailable()) hapticFeedbackSelectionChanged();

    if (id === "send" || id === "receive") {
      if (!isConnected) {
        toast("Сначала подключите кошелёк");
        void openConnectModal();
        return;
      }
      openModal(id);
      return;
    }

    if (id === "withdraw" || id === "exchange") {
      openModal(id);
    }
  };

  return (
    <header className="wallet-header-ton">
      <div className="wallet-header-ton__top">
        <button className="wallet-avatar-btn" type="button" onClick={onAvatarClick} aria-label="Аккаунт и выход">
          <Avatar size={48}>{walletAddress ? walletAddress.slice(0, 2).toUpperCase() : "W"}</Avatar>
        </button>
        <div className="wallet-header-ton__balance-wrap">
          <div className="wallet-header-ton__balance">{formatBalance(balance)}</div>
        </div>
        <div className="wallet-header-ton__top-spacer" aria-hidden />
      </div>

      <div className="wallet-actions-ton">
        {actions.map((item) => (
          <button key={item.id} className="wallet-action-ton" type="button" onClick={() => onAction(item.id)}>
            <span className="wallet-action-ton__icon">
              <ActionIcon type={item.icon} />
            </span>
            <span className="wallet-action-ton__label">{item.title}</span>
          </button>
        ))}
      </div>

      <AccountModal open={accountModalOpen} onOpenChange={setAccountModalOpen} />
    </header>
  );
};
