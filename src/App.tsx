import { useMemo } from "react";
import { MarketingBanner } from "./components/MarketingBanner";
import { WalletHeader } from "./components/WalletHeader";
import { SendModal } from "./components/Modals/SendModal";
import { ReceiveModal } from "./components/Modals/ReceiveModal";
import { PlaceholderModal } from "./components/Modals/PlaceholderModal";
import { LogoutModal } from "./components/Modals/LogoutModal";
import { useAppStore } from "./store/useAppStore";
import { useTelegram } from "./hooks/useTelegram";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const activeModal = useAppStore((state) => state.activeModal);
  useTelegram();
  useTonConnect();

  const modal = useMemo(() => {
    if (activeModal === "send") return <SendModal />;
    if (activeModal === "receive") return <ReceiveModal />;
    if (activeModal === "withdraw") return <PlaceholderModal title="Вывести" />;
    if (activeModal === "exchange") return <PlaceholderModal title="Обменять" />;
    if (activeModal === "logout") return <LogoutModal />;
    return null;
  }, [activeModal]);

  return (
    <main className="app-container">
      <WalletHeader />
      <MarketingBanner />
      {modal}
    </main>
  );
}

export default App;
