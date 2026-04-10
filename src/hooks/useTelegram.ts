import { useEffect } from "react";
import {
  bindThemeParamsCssVars,
  expandViewport,
  hapticFeedbackSelectionChanged,
  isThemeParamsDark,
  init,
  miniAppReady,
  mountBackButton,
  mountMainButton,
  mountMiniApp,
  mountThemeParams,
  setMainButtonParams,
  showBackButton,
  hideBackButton,
  onBackButtonClick,
  offBackButtonClick
} from "@telegram-apps/sdk";
import { useAppStore } from "../store/useAppStore";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        colorScheme?: "light" | "dark";
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
      };
    };
  }
}

export const useTelegram = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const closeModal = useAppStore((state) => state.closeModal);

  useEffect(() => {
    let cleanupInit: VoidFunction | undefined;
    try {
      cleanupInit = init();
      if (mountMiniApp.isAvailable()) mountMiniApp();
      if (mountThemeParams.isAvailable()) mountThemeParams();
      if (bindThemeParamsCssVars.isAvailable()) bindThemeParamsCssVars();
      if (mountBackButton.isAvailable()) mountBackButton();
      if (mountMainButton.isAvailable()) mountMainButton();
      if (setMainButtonParams.isAvailable()) setMainButtonParams({ isVisible: false });
      if (expandViewport.isAvailable()) expandViewport();
      if (miniAppReady.isAvailable()) miniAppReady();
      document.documentElement.dataset.theme = isThemeParamsDark() ? "dark" : "light";
    } catch {
      // Local web preview can run outside Telegram environment.
    }

    return () => {
      cleanupInit?.();
    };
  }, []);

  useEffect(() => {
    const handleBack = () => closeModal();
    try {
      if (activeModal) {
        if (showBackButton.isAvailable()) showBackButton();
        if (onBackButtonClick.isAvailable()) onBackButtonClick(handleBack);
      } else {
        if (hideBackButton.isAvailable()) hideBackButton();
        if (offBackButtonClick.isAvailable()) offBackButtonClick(handleBack);
      }
    } catch {
      // Ignore outside Telegram environment.
    }

    return () => {
      try {
        if (offBackButtonClick.isAvailable()) offBackButtonClick(handleBack);
      } catch {
        // Ignore outside Telegram environment.
      }
    };
  }, [activeModal, closeModal]);

  return {
    webApp: window.Telegram?.WebApp,
    colorScheme: window.Telegram?.WebApp?.colorScheme ?? "light",
    tapFeedback: () => {
      if (hapticFeedbackSelectionChanged.isAvailable()) hapticFeedbackSelectionChanged();
    }
  };
};
