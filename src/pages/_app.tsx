import Nav from "@/components/Nav";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginForm from "@/components/login/loginForm";

const queryClinet = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClinet}>
      <Nav />
      <Component {...pageProps} />
      <LoginForm />
    </QueryClientProvider>
  );
}
