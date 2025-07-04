import { runAppleScript } from "run-applescript";
import { Tab } from "./Tab";

// Tabs
export async function getTabs() {
  const windowCountScript = `tell application "Safari" to return count of windows`;
  const windowCount = parseInt(await runAppleScript(windowCountScript), 10);

  const tabs: Tab[] = [];

  // Iterate through each window
  for (let windowIndex = 1; windowIndex <= windowCount; windowIndex++) {
    // Get all tabs in this window in one call
    const windowTabsScript = `
      tell application "Safari"
        set tabData to ""
        set windowTabs to tabs of window ${windowIndex}
        repeat with i from 1 to count of windowTabs
          set currentTab to item i of windowTabs
          set tabData to tabData & name of currentTab & ":::" & URL of currentTab
          if i < count of windowTabs then
            set tabData to tabData & "|||"
          end if
        end repeat
        return tabData
      end tell
    `;

    const tabsData = await runAppleScript(windowTabsScript);

    if (tabsData && tabsData.length > 0) {
      // Parse the tab data
      const tabEntries = tabsData.split("|||");

      tabEntries.forEach((tabEntry, index) => {
        const [title, url] = tabEntry.split(":::");
        const tabIndex = index + 1;

        tabs.push(new Tab(title, url || "", "", windowIndex, tabIndex, ""));
      });
    }
  }

  return tabs;
}

export async function setActiveTab(tab: Tab): Promise<void> {
  await runAppleScript(`
  tell application "Safari"
      set windowID to ${tab.windowsId}
      set tabID to ${tab.tabIndex}
      set windowObj to window id windowID
      set tabObj to tab tabID of windowObj
      set index of windowObj to 1
      set current tab of windowObj to tabObj
      activate
    end tell
  `);
}
