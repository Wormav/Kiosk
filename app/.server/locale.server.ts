import { createCookie } from "react-router";

export type Locale = "fr" | "en";

export const localeCookie = createCookie("locale", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
});

export const getLocale = async (request: Request): Promise<Locale> => {
  const cookieHeader = request.headers.get("Cookie");
  const locale = await localeCookie.parse(cookieHeader);
  return locale === "en" ? "en" : "fr"; // Default to French
};
