import { homedir } from "os";
import { join } from "path";

export const historyDatabasePath = join(
  homedir(),
  "Library",
  "Application Support",
  "Arc",
  "User Data",
  "Default",
  "History"
);

export function getHistoryQuery(searchText?: string, limit = 100) {
  const whereClause = searchText
    ? searchText
        .split(" ")
        .filter((word) => word.length > 0)
        .map((term) => `(urls.url LIKE "%${term}%" OR title LIKE "%${term}%")`)
        .join(" AND ")
    : undefined;

  return `
    SELECT DISTINCT urls.url as url, title, urls.id as id FROM 'visits'  
    LEFT JOIN urls on urls.id = visits.url
    where visit_duration > 0 ${whereClause ? `AND ${whereClause}` : ""}
    ORDER BY visit_time desc LIMIT 0,${limit}
    `;
}
