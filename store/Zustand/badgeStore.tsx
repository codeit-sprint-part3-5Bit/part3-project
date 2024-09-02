import create from "zustand";

interface BadgeState {
  badgeURL: string;
  setBadgeURL: (url: string) => void;
}

const useBadgeStore = create<BadgeState>((set) => ({
  badgeURL: "",
  setBadgeURL: (url: string) => set({ badgeURL: url }),
}));

export default useBadgeStore;
