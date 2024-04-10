import { runAppleScript } from "run-applescript";
import { Tab } from "./types";

// Tabs

export async function getTabs() {
  const response = await runAppleScript(`
    on escape_value(this_text)
      set AppleScript's text item delimiters to the "\\""
      set the item_list to every text item of this_text
      set AppleScript's text item delimiters to the "\\\\\\""
      set this_text to the item_list as string
      set AppleScript's text item delimiters to ""
      return this_text
    end replace_chars

    set _output to ""

    if application "Arc" is running then
      tell application "Arc"
        set _window_index to 1
        set _tab_index to 1
        
        repeat with _tab in tabs of first window
          set _title to my escape_value(get title of _tab)
          set _url to get URL of _tab
          set _location to get location of _tab
          
          set _output to (_output & "{ \\"title\\": \\"" & _title & "\\", \\"url\\": \\"" & _url & "\\", \\"windowId\\": " & _window_index & ", \\"tabId\\": " & _tab_index & " , \\"location\\": \\"" & _location & "\\" }")
          
          if _tab_index < (count tabs of first window) then
            set _output to (_output & ",\\n")
          else
            set _output to (_output & "\\n")
          end if
          
          set _tab_index to _tab_index + 1
        end repeat
      end tell
    end if
    
    return "[\\n" & _output & "\\n]"
  `);

  return response ? (JSON.parse(response) as Tab[]) : undefined;
}

export async function selectTab(tab: Tab) {
  await runAppleScript(`
    tell application "Arc"
      tell window (${tab.windowId} as number)
        tell tab (${tab.tabId} as number) to select
      end tell

      activate
    end tell
  `);
}
