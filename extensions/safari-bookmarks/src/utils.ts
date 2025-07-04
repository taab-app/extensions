const parseUrl = (url: string) => {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
};

export const getUrlDomain = (url: string) => {
  const parsedUrl = parseUrl(url);
  if (parsedUrl && parsedUrl.hostname) {
    return parsedUrl.hostname.replace(/^www\./, "");
  }
};
