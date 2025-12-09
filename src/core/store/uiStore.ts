/**
 * UI Store
 * UI state management using Zustand
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UIState, Toast } from "./types";

// Generate unique toast ID
const generateId = () =>
  `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * UI Store - NOT persisted
 */
export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open: boolean) =>
        set({ sidebarOpen: open }, false, "setSidebarOpen"),
      toggleSidebar: () =>
        set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          "toggleSidebar"
        ),

      // Modal
      activeModal: null,
      modalData: null,
      openModal: (modalId: string, data?: Record<string, unknown>) =>
        set(
          {
            activeModal: modalId,
            modalData: data || null,
          },
          false,
          "openModal"
        ),
      closeModal: () =>
        set(
          {
            activeModal: null,
            modalData: null,
          },
          false,
          "closeModal"
        ),

      // Toast notifications
      toasts: [],
      addToast: (toast: Omit<Toast, "id">) => {
        const newToast: Toast = {
          ...toast,
          id: generateId(),
          duration: toast.duration ?? 5000,
        };
        set(
          (state) => ({ toasts: [...state.toasts, newToast] }),
          false,
          "addToast"
        );

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(newToast.id);
          }, newToast.duration);
        }
      },
      removeToast: (id: string) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }),
          false,
          "removeToast"
        ),
      clearToasts: () => set({ toasts: [] }, false, "clearToasts"),
    }),
    { name: "UIStore" }
  )
);

// Selector hooks
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useModalData = () => useUIStore((state) => state.modalData);
export const useToasts = () => useUIStore((state) => state.toasts);

// Actions (for use outside React components)
export const uiStoreActions = {
  setSidebarOpen: (open: boolean) => useUIStore.getState().setSidebarOpen(open),
  toggleSidebar: () => useUIStore.getState().toggleSidebar(),
  openModal: (modalId: string, data?: Record<string, unknown>) =>
    useUIStore.getState().openModal(modalId, data),
  closeModal: () => useUIStore.getState().closeModal(),
  addToast: (toast: Omit<Toast, "id">) => useUIStore.getState().addToast(toast),
  removeToast: (id: string) => useUIStore.getState().removeToast(id),
  clearToasts: () => useUIStore.getState().clearToasts(),

  // Toast helpers
  toast: {
    success: (title: string, message?: string) =>
      useUIStore.getState().addToast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      useUIStore.getState().addToast({ type: "error", title, message }),
    warning: (title: string, message?: string) =>
      useUIStore.getState().addToast({ type: "warning", title, message }),
    info: (title: string, message?: string) =>
      useUIStore.getState().addToast({ type: "info", title, message }),
  },
};
