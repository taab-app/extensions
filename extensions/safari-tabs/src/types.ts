export type Tab = {
  windowId: number;
  tabId: number;
  url: string;
  title: string;
  location: TabLocation;
};

export type TabLocation = "topApp" | "pinned" | "unpinned";
