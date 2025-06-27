"use client";

import dynamic from "next/dynamic";
import { Fragment } from "react";
import { Toaster } from "sonner";

const HomeView = dynamic(() => import("./_views/index").then((mod) => ({ default: mod.HomeView })), { ssr: false });

export default function HomePage() {
  return (
    <Fragment>
      <HomeView />
      <Toaster position="top-right" richColors />
    </Fragment>
  );
}
