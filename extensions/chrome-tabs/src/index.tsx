import { useEffect, memo } from "react";
import { List, ListItem } from "@taab-app/api";
import { usePromise, getFavicon } from "@taab-app/utils";

import { getTabs, setActiveTab } from "./chrome";

export function Extension({ visible }: { query: string; visible: boolean }) {
  const { data, isLoading, revalidate } = usePromise(getTabs);

  useEffect(() => {
    revalidate();
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
        const id = `chrome-${item.title}-${item.windowsId}-${item.tabIndex}`;

        return (
          <ListItem
            key={id}
            id={id}
            title={item.title}
            subtitle={item.url}
            icon={getFavicon(item.url)}
            action={() => {
              setActiveTab(item);
            }}
          />
        );
      })}
    </List>
  );
});
