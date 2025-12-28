import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { getLocale } from "./.server/locale.server";
import "./app.css";

const theme = createTheme({
  primaryColor: "kiosk",
  colors: {
    kiosk: [
      "#f0fdf6",
      "#D5F5E8",
      "#a7f3d0",
      "#6ee7b7",
      "#34d399",
      "#10b981",
      "#059669",
      "#047857",
      "#065f46",
      "#064e3b",
    ],
  },
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const locale = await getLocale(request);
  return { locale };
};

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/jpeg", href: "/meetkiosk_logo.jpeg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="fr" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body suppressHydrationWarning>
      <MantineProvider theme={theme} forceColorScheme="light">
        {children}
      </MantineProvider>
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

import { Navbar } from "./components/Navbar";

const App = ({ loaderData }: Route.ComponentProps) => {
  const { locale } = loaderData;

  return (
    <>
      <Navbar locale={locale} />
      <Outlet context={{ locale }} />
    </>
  );
};

export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
};
