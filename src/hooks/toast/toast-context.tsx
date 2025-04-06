
import * as React from "react";
import { State, initialState, listeners, toast, dispatch } from "./toast-store";
import type { ToasterToast } from "./toast-store";

// Create a context for the toast state
export type ToastContextType = {
  toasts: ToasterToast[];
  toast: typeof toast;
  dismiss: (toastId?: string) => void;
};

export const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  toast: () => ({ id: "", dismiss: () => {}, update: () => {} }),
  dismiss: () => {},
});

// Create a provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<State>(initialState);

  // Listeners setup
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return React.createElement(
    ToastContext.Provider,
    {
      value: {
        toasts: state.toasts,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
      },
    },
    children
  );
};

// Hook to use the toast context
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}
