import { useEffect, useRef, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import { useAppStore } from "../store/useAppStore";

const mockTonToRub = 270;
const tonCenterApi = "https://toncenter.com/api/v2/getAddressBalance";

export const useTonConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const setIsConnected = useAppStore((state) => state.setIsConnected);
  const setBalance = useAppStore((state) => state.setBalance);
  const setWalletAddress = useAppStore((state) => state.setWalletAddress);

  const prevAddressRef = useRef("");
  const [restorationDone, setRestorationDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void tonConnectUI.connectionRestored.finally(() => {
      if (cancelled) return;
      prevAddressRef.current = tonConnectUI.account?.address ?? "";
      setRestorationDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, [tonConnectUI]);

  useEffect(() => {
    if (!restorationDone) return;
    const prev = prevAddressRef.current;
    const next = address || "";
    if (next && !prev) {
      toast.success("Кошелёк подключён");
    }
    prevAddressRef.current = next;
  }, [address, restorationDone]);

  useEffect(() => {
    let cancelled = false;
    const connected = Boolean(address);
    setIsConnected(connected);
    setWalletAddress(address);

    if (!connected) {
      setBalance(0);
      return;
    }

    const loadBalance = async () => {
      try {
        const response = await fetch(`${tonCenterApi}?address=${encodeURIComponent(address)}`);
        if (!response.ok) {
          throw new Error("Failed to load balance");
        }

        const data = (await response.json()) as { ok?: boolean; result?: string };
        if (!data.ok || typeof data.result !== "string") {
          throw new Error("Invalid TON response");
        }

        const tonBalance = Number(data.result) / 1_000_000_000;
        if (!cancelled) {
          setBalance(tonBalance * mockTonToRub);
        }
      } catch {
        if (!cancelled) {
          setBalance(0);
          toast.error("Ошибка загрузки баланса");
        }
      }
    };

    void loadBalance();
    return () => {
      cancelled = true;
    };
  }, [address, setBalance, setIsConnected, setWalletAddress]);

  const openConnectModal = async () => {
    try {
      await tonConnectUI.openModal();
    } catch {
      toast.error("Ошибка подключения кошелька");
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      toast.success("Кошелёк отключён");
    } catch {
      toast.error("Ошибка отключения кошелька");
    }
  };

  return {
    tonConnectUI,
    walletAddress: address,
    openConnectModal,
    disconnectWallet
  };
};
