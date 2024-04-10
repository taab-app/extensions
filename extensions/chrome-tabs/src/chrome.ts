import { runAppleScript } from "run-applescript";
import { Tab } from "./Tab";

// Tabs
export async function getTabs(useOriginalFavicon = false) {
  const faviconFormula = useOriginalFavicon
    ? `execute of tab _tab_index of window _window_index javascript ¬
                  "document.head.querySelector('link[rel~=icon]').href;"`
    : '""';

  try {
    const openTabs = await runAppleScript(`
        set _output to ""
        if application "Google Chrome" is running then
          tell application "Google Chrome"
            repeat with w in windows
              set _w_id to get id of w as inches as string
              set _tab_index to 1
              repeat with t in tabs of w
                set _title to get title of t
                set _url to get URL of t
                set _favicon to ${faviconFormula}
                set _output to (_output & _title & "${Tab.TAB_CONTENTS_SEPARATOR}" & _url & "${Tab.TAB_CONTENTS_SEPARATOR}" & _favicon & "${Tab.TAB_CONTENTS_SEPARATOR}" & _w_id & "${Tab.TAB_CONTENTS_SEPARATOR}" & _tab_index & "\\n")
                set _tab_index to _tab_index + 1
              end repeat
            end repeat
          end tell
        end if
        return _output
    `);

    return openTabs
      .split("\n")
      .filter((line) => line.length !== 0)
      .map((line) => Tab.parse(line));
  } catch (err) {
    console.log('Can\'t get application "Google Chrome"');
    return [];
  }
}

export async function setActiveTab(tab: Tab): Promise<void> {
  await runAppleScript(`
    tell application "Google Chrome"
      activate
      set _wnd to first window where id is ${tab.windowsId}
      set index of _wnd to 1
      set active tab index of _wnd to ${tab.tabIndex}
    end tell
    return true
  `);
}
