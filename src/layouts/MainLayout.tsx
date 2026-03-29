import { type Child } from "hono/jsx";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { ToastContainer, toastScript } from "../components/Toast";

type MainLayoutProps = {
  children: Child;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  extraHeadAssets?: Child;
  currentPath?: string;
  breadcrumbLabel?: string;
  hideBreadcrumb?: boolean;
  fullWidth?: boolean;
};

export default function MainLayout({
  children,
  isLoggedIn = false,
  isAdmin = false,
  extraHeadAssets,
  currentPath = "/",
  breadcrumbLabel,
  hideBreadcrumb = false,
  fullWidth = false,
}: MainLayoutProps) {
  const containerClass = fullWidth ? "max-w-[1400px]" : "max-w-7xl";

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          src="https://unpkg.com/htmx.org@1.9.10"
          integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
          crossorigin="anonymous"
        ></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Nega</title>
        {extraHeadAssets}
      </head>
      <body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        <Nav
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          currentPath={currentPath}
        />
        <main class={`${containerClass} mx-auto px-6 flex-1 py-8 w-full`}>
          {!hideBreadcrumb && currentPath !== "/" && (
            <Breadcrumb
              currentPath={currentPath}
              customLabel={breadcrumbLabel}
            />
          )}
          {children}
        </main>
        <Footer isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <ToastContainer />
        <script dangerouslySetInnerHTML={{ __html: toastScript }} />
      </body>
    </html>
  );
}
