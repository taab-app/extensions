import { List, ListItem } from "@taab-app/api";
import { getFavicon, open } from "@taab-app/utils";

export function Extension({ query }: { query: string }) {
  const data = [
    {
      id: "google",
      icon: getFavicon("https://www.google.com"),
      title: `Search on google : ${query}`,
      action: () => {
        open(`https://www.google.com/search?q=${query}`);
      },
    },
    {
      id: "maps",
      icon: getFavicon("https://www.maps.google.com"),
      title: `Search on maps : ${query}`,
      action: () => {
        open(`https://www.google.com/maps?q=${query}`);
      },
    },
    {
      id: "youtube",
      icon: getFavicon("https://www.youtube.com/"),
      title: `Search on youtube : ${query}`,
      action: () => {
        open(`https://www.youtube.com/results?search_query=${query}`);
      },
    },
  ];

  return (
    <List loading={false}>
      {data.map((item: any) => {
        return (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.title}
            icon={item.icon}
            action={item.action}
          />
        );
      })}
    </List>
  );
}
