import { type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'
import MainLayout from "../components/global/Layout"
import '../styles/styles.css';

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <ClerkProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
