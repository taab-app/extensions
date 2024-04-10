import { List, ListItem } from "@taab-app/api";
import path from "path";
import { homedir } from "os";
import { v1 } from "uuid";
import { exec } from "child_process";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { getRecentProjects } from "./getRecentProjects";
import { useDatabase } from "./useDatabase";

type Database = any;

const iconPath = path.join(__dirname, "../assets/icon.png");

export function Extension({ visible }: { query: string; visible: boolean }) {
  const dbRefs = useRef<Database[]>();
  const [data, setData] = useState({ items: [], loading: true });
  const { createDatabase, queryDb } = useDatabase();

  const fetchData = useCallback(
    async (dbs: Database[]) => {
      try {
        const result = await Promise.all(
          dbs.map(async (db) => {
            const res = await queryDb(db, "");
            const json = JSON.parse(res[0].value);
            return json.map((entry) => {
              const entryPath = entry.editor.resource.replace("file://", "");
              const subtitle = entryPath.replace(homedir(), "~");
              const title = path.basename(entryPath);
              const id = v1();

              return {
                path: entryPath,
                title,
                subtitle,
                id,
              };
            });
          })
        );
        setData({ loading: false, items: result.flat(1) });
      } catch (err) {
        console.log(err);
        setData({ loading: false, items: [] });
      }
    },
    [queryDb, setData]
  );

  useEffect(() => {
    (async () => {
      if (visible) {
        setData({ loading: true, items: [] });

        const projects = await getRecentProjects();

        const databases = await Promise.all(
          projects.map((projectPath) =>
            createDatabase(path.join(projectPath, "state.vscdb"))
          )
        );
        dbRefs.current = databases;

        await fetchData(databases);
      } else {
        const dbs = dbRefs.current;
        for (const db of dbs || []) {
          db.close();
        }
      }
    })();
  }, [visible]);

  return <ExtensionContent isLoading={data.loading} items={data.items} />;
}

const ExtensionContent = memo(function ExtensionContent({
  isLoading,
  items,
}: {
  isLoading: boolean;
  items: any;
}) {
  return (
    <List loading={isLoading}>
      {(items || []).map((item: any) => {
        const id = `vscode-${item.id}`;

        return (
          <ListItem
            key={id}
            id={id}
            title={item.title}
            subtitle={item.subtitle}
            icon={{
              type: "file",
              source: iconPath,
            }}
            action={() => {
              console.log("ACTIVATE", item.path);
              exec(`/usr/local/bin/code-insiders ${item.path}`);
            }}
          />
        );
      })}
    </List>
  );
});
