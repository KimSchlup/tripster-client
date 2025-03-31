// components/BannerWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Banner from "./Banner";

export default function BannerWrapper(
  { children }: { children: React.ReactNode },
) {
  const pathname = usePathname();
  const paths_without_header = ["/my-roadtrips/"];
  const show_banner = !paths_without_header.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div style={{ paddingTop: show_banner ? "65px" : "0px" }}>
      {show_banner && <Banner />}
      {children}
    </div>
  );
}
