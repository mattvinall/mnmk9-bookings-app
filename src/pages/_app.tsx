import { type AppType } from "next/app";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import MainLayout from "../components/global/Layout"
import '../styles/styles.css';

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { useRouter } from "next/router";

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const SignedOutRedirect = () => {
  const router = useRouter();

  router.push("/sign-in");

  return null;
};

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {

  const router = useRouter();

  return (
    <ClerkProvider {...pageProps}>
      {publicPages.includes(router.pathname) ? (
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
            <SignedOutRedirect />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);