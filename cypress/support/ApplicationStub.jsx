import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { App } from "../../src/App";
import "../../src/i18n";
import "../../src/index.css";

export const ApplicationStub = ({ children, darkMode, lang, loader }) => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <App darkModeParameter={darkMode} />,
      children: [
        { path: "/", element: children },
        {
          path: "/:category",
          element: children,
          loader,
        },
      ],
    },
    ,
  ]);
  const { i18n } = useTranslation();
  if (lang) {
    i18n.changeLanguage(lang);
  }
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
