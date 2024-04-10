import { homedir } from "os";
import { join } from "path";
import fs from "fs";

export const storageJSON = join(
  homedir(),
  "Library",
  "Application Support",
  "Code - Insiders",
  "User",
  "globalStorage",
  "storage.json"
);

export const workspaces = join(
  homedir(),
  "Library",
  "Application Support",
  "Code - Insiders",
  "User",
  "workspaceStorage"
);

export async function getRecentProjects() {
  const { default: json } = await import(storageJSON);
  const windowsState = json.windowsState;
  const activeFolders = [
    windowsState.lastActiveWindow.folder,
    ...windowsState.openedWindows.map((win) => win.folder),
  ];

  const result = [];
  for (const dir of fs.readdirSync(workspaces)) {
    const workspaceJSON = join(workspaces, dir, "workspace.json");
    if (!fs.existsSync(workspaceJSON)) {
      continue;
    }

    const { default: json } = await import(workspaceJSON);
    const isMatch = activeFolders.find((folder) => folder === json.folder);

    if (isMatch) {
      result.push(join(workspaces, dir));
    }
  }

  return result;
}
