"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useWalkthroughStore } from "@/components/Walkthrough/WalkthroughContext";
import { walkthroughBarrier } from "@/components/Walkthrough/WalktroughSyncBarrier";
import { ReactWalletsProvider } from "@/services/wallets/ReactWalletsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const initializeWalkthrough = useWalkthroughStore((state) => state.initializeWalkthrough);
   const pathname = usePathname();

   useEffect(() => {
      walkthroughBarrier.onBarrierComplete(() => {
         initializeWalkthrough();
      });

      return () => {
         walkthroughBarrier.reset();
      };
   }, [pathname]);

   return (
      <QueryClientProvider client={queryClient}>
         <ReactWalletsProvider>
            <SidebarProvider>{children}</SidebarProvider>
         </ReactWalletsProvider>
      </QueryClientProvider>
   );
}
