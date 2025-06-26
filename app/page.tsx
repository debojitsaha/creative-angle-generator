"use client";

import dynamic from "next/dynamic";

const HomeView = dynamic(() => import("./_views/index").then((mod) => ({ default: mod.HomeView })), { ssr: false });

export default function HomePage() {
  return <HomeView />;
}
