"use client";

import "@/styles/globals.css";
import { store } from "@/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Footer } from "@/container/footer";
import Header from "@/components/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className="main">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </Provider>
  );
}
