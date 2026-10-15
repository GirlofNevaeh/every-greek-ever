import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { UnlockProvider } from "@/components/paywall";
import { I18nProvider } from "@/lib/i18n";
import { readUnlock } from "@/lib/paywall.functions";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  loader: async () => {
    try {
      return await readUnlock();
    } catch {
      return { ok: false };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Every Greek Ever" },
      { name: "theme-color", content: "#0D5EAF" },
      {
        name: "description",
        content:
          "A bright guide to ancient Greece for ages 5 to 12. People, gods, myths, thinkers, places, and a class quiz.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,620;9..144,700&family=Lexend:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  const { ok } = Route.useLoaderData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <I18nProvider>
            <UnlockProvider unlocked={ok}>
              <Outlet />
            </UnlockProvider>
          </I18nProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
