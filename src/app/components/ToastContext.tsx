import { createContext, useContext, useState, ReactNode } from "react";
import { SystemToast } from "./SystemToast";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: Toast["type"], title: string, message?: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: Toast["type"], title: string, message?: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <SystemToast
          isVisible={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
