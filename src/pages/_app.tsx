import Nav from "@/components/Nav";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/context/AuthContext";

const queryClinet = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClinet}>
      <AuthProvider>
        <Nav />
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
