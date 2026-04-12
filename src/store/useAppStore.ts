import { create } from "zustand";

export type ModalType = "send" | "receive" | "withdraw" | "exchange" | "logout";

interface ModalState {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

interface AppStore extends ModalState {
  isConnected: boolean;
  balance: number;
  walletAddress: string;
  setBalance: (balance: number) => void;
  setIsConnected: (status: boolean) => void;
  setWalletAddress: (address: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeModal: null,
  isConnected: false,
  balance: 0,
  walletAddress: "",
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setBalance: (balance) => set({ balance }),
  setIsConnected: (status) => set({ isConnected: status }),
  setWalletAddress: (address) => set({ walletAddress: address })
}));
