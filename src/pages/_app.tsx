import { type AppType } from "next/app";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import MainLayout from "../components/global/Layout"
import '../styles/styles.css';

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const publicPages: Array<string> = ["/", "/contact-us"];

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      {isPublicPage ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        <>
          <SignedIn>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
