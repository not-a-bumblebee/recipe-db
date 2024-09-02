import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import "./tailwind.css";
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider } from "@mantine/core";
import SearchBar from "./components/Searchbar";
import { useEffect } from "react";
import { useAuthStore } from "./store";


export function Layout({ children }: { children: React.ReactNode }) {

  const navigate = useNavigate()
  const pesterUsername = useAuthStore((state) => state.pesterUsername)
  const _hasHydrated = useAuthStore((state) => state._hasHydrated)
  const userCred = useAuthStore((state) => state.userCred)
  
  const location = useLocation()

  useEffect(() => {

    if (userCred?.displayName == 'anonymouse' && _hasHydrated) {
      navigate("/settings")
    }

  }, [pesterUsername, location.pathname])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <SearchBar />
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
