import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles.css";
import "@telegram-apps/telegram-ui/dist/styles.css";

const manifestUrl =
  import.meta.env.VITE_TONCONNECT_MANIFEST_URL ?? `${window.location.origin}/tonconnect-manifest.json`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl} restoreConnection>
      <AppRoot appearance="dark">
        <App />
        <Toaster position="top-center" />
      </AppRoot>
    </TonConnectUIProvider>
  </React.StrictMode>
);