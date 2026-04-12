import { useAppStore } from "../store/useAppStore";
import { formatBalance } from "../utils/formatBalance";
import { useOpenConnectModal } from "../hooks/useOpenConnectModal";
import { useWalletGate } from "../hooks/useWalletGate";
import { hapticFeedbackImpactOccurred } from "@telegram-apps/sdk";

const actions = [
  { id: "send", title: "Перевести", icon: "send" },
  { id: "receive", title: "Пополнить", icon: "receive" },
  { id: "withdraw", title: "Вывести", icon: "scan" },
  { id: "exchange", title: "Обменять", icon: "swap" }
] as const;

const truncateAddress = (addr: string) => {
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 4)} … ${addr.slice(-4)}`;
};

const HeaderIconAccount = () => (
  <svg className="wallet-header-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" />
    <circle cx="12" cy="9.5" r="3" fill="none" />
    <path d="M5.5 18.25c1.15-2.75 3.85-4.5 6.5-4.5s5.35 1.75 6.5 4.5" fill="none" />
  </svg>
);

const ChevronDown = () => (
  <svg className="wallet-pill-chevron" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TonBadgeIcon = () => (
  <svg className="wallet-ton-badge-svg" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M13.5 4L6 13.2h4.65L10.5 20 18 10.8h-4.65L13.5 4z"
    />
  </svg>
);

const ActionIcon = ({ type }: { type: (typeof actions)[number]["icon"] }) => {
  if (type === "send") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <path d="M12 19V6M12 6l-3.5 3.5M12 6l3.5 3.5" fill="none" />
      </svg>
    );
  }

  if (type === "receive") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <path d="M12 5v13M12 18l-3.5-3.5M12 18l3.5-3.5" fill="none" />
      </svg>
    );
  }

  if (type === "scan") {
    return (
      <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
        <path d="M7 7H4V4M17 7h3V4M7 17H4v3M17 17h3v3" fill="none" />
        <rect x="8" y="8" width="8" height="8" rx="1.5" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="action-icon-svg" aria-hidden="true">
      <path d="M8 9l2-2 2 2M12 7v5" fill="none" />
      <path d="M16 15l-2 2-2-2M12 17v-5" fill="none" />
    </svg>
  );
};

export const WalletHeader = () => {
  const balance = useAppStore((state) => state.balance);
  const isConnected = useAppStore((state) => state.isConnected);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const openConnectModal = useOpenConnectModal();
  const openModal = useAppStore((state) => state.openModal);
  const openActionModal = useWalletGate();

  const handleAccountClick = async () => {
    if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("light");
    if (isConnected) {
      openModal("logout");
      return;
    }
    await openConnectModal();
  };

  const handlePillClick = async () => {
    if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("light");
    await openConnectModal();
  };

  const pillLabel = "Кошелёк";

  return (
    <header className="wallet-header">
      <div className="wallet-header-bar">
        <button
          className="wallet-header-icon-btn"
          type="button"
          onClick={() => void handleAccountClick()}
          aria-label="Аккаунт"
        >
          <HeaderIconAccount />
        </button>
        <button className="wallet-pill" type="button" onClick={() => void handlePillClick()}>
          <span className="wallet-pill-emoji" aria-hidden="true">
            {isConnected ? "😀" : "👛"}
          </span>
          <span className="wallet-pill-text">{pillLabel}</span>
          <ChevronDown />
        </button>
        <div className="wallet-header-side wallet-header-side--spacer" aria-hidden="true" />
      </div>

      <div className="wallet-balance-row">
        <div className="wallet-balance">{formatBalance(balance)}</div>
        <span className="wallet-ton-badge" aria-hidden="true">
          <TonBadgeIcon />
        </span>
      </div>

      <div className="wallet-address-row">
        <span className="wallet-address-text">{isConnected && walletAddress ? truncateAddress(walletAddress) : ""}</span>
      </div>

      <div className="wallet-actions">
        {actions.map((item) => (
          <button
            key={item.id}
            className="action-button"
            onClick={() => void openActionModal(item.id)}
            type="button"
          >
            <span className="action-button-circle">
              <ActionIcon type={item.icon} />
            </span>
            <span className="action-title">{item.title}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
