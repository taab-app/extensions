import { List, ListItem } from "@taab-app/api";
import { usePromise, getFavicon } from "@taab-app/utils";

import { getTabs, selectTab } from "./arc";
import { memo, useEffect } from "react";

export function Extension({ visible }: { query: string; visible: boolean }) {
  const { data, isLoading, revalidate } = usePromise(getTabs);

  useEffect(() => {
    if (visible) revalidate();
  }, [visible]);

  return <ExtensionContent isLoading={isLoading} items={data} />;
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
        const id = `arc-${item.title}-${item.windowId}-${item.tabId}`;

        return (
          <ListItem
            key={id}
            id={id}
            title={item.title}
            subtitle={item.url}
            icon={getFavicon(item.url)}
            action={() => {
              selectTab(item);
            }}
          />
        );
      })}
    </List>
  );
});
