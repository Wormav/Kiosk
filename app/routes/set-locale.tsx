import { redirect } from "react-router";
import { localeCookie, type Locale } from "~/.server/locale.server";
import type { Route } from "./+types/set-locale";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const locale = formData.get("locale") as Locale;
  const redirectTo = formData.get("redirectTo") as string || "/";

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await localeCookie.serialize(locale),
    },
  });
};
