import { memo } from "react";
import { List, ListItem } from "@taab-app/api";
import { getFavicon, open } from "@taab-app/utils";

import useBookmarks from "./useBookmarks";

export function Extension() {
  const { bookmarks, isLoading } = useBookmarks();

  return <ExtensionContent isLoading={isLoading} items={bookmarks} />;
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
        const id = `safari-bookmark-${item.title}-${item.url}`;

        return (
          <ListItem
            key={id}
            id={id}
            title={item.title}
            subtitle={item.url}
            icon={getFavicon(item.url, { size: 16 })}
            action={() => {
              open(item.url);
            }}
          />
        );
      })}
    </List>
  );
});
