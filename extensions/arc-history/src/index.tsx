import { List, ListItem } from "@taab-app/api";
import { getFavicon, open } from "@taab-app/utils";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDatabase } from "./useDatabase";
import { useDebounce } from "./useDebounce";

type Database = any;

export function Extension({
  query,
  visible,
}: {
  query: string;
  visible: boolean;
}) {
  const dbRef = useRef<Database>();
  const [data, setData] = useState({ items: [], loading: false });
  const debouncedValue = useDebounce(query, 50);

  const { createDatabase, queryDb } = useDatabase();

  const fetchData = useCallback(
    async (db: Database, input: string) => {
      try {
        const result = queryDb(db, input);
        setData({ loading: false, items: result });
      } catch (err) {
        setData({ loading: false, items: [] });
      }
    },
    [queryDb, setData]
  );

  useEffect(() => {
    (async () => {
      dbRef.current = await createDatabase();
      fetchData(dbRef.current, query);
      if (visible) {
      } else {
        const db = await dbRef.current;
        if (db) {
          db?.close();
          dbRef.current = undefined;
        }
      }
    })();
  }, [visible]);

  useEffect(() => {
    (async () => {
      const db = await dbRef.current;
      if (db) {
        fetchData(db, debouncedValue);
      }
    })();
  }, [debouncedValue]);

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
        const id = `arc-${item.id}`;

        return (
          <ListItem
            key={id}
            id={id}
            title={item.title}
            subtitle={item.url}
            icon={getFavicon(item.url)}
            action={() => {
              open(item.url);
            }}
          />
        );
      })}
    </List>
  );
});
