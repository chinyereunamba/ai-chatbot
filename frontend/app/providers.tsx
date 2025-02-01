"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { Session } from "next-auth";

export interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps, session }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <SessionProvider session={session}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
