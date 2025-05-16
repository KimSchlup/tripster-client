import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/hooks/useToast";
import { RoadtripInvitationProvider } from "@/hooks/useRoadtripInvitations";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MapMates - Your Ultimate Road Trip Companion",
  description: "Plan your perfect road trip with MapMates. Discover routes, find hidden gems, share with friends, and navigate with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable}`}
            style={{ paddingTop: "144px" }} // Page is shifted down by 144px to prevent overlap with Header
      >
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              // general theme options are set in token, meaning all primary elements (button, menu, ...) will have this color
              colorPrimary: "#22426b", // selected input field boarder will have this color as well
              borderRadius: 8,
              colorText: "#fff",
              fontSize: 16,

              // Alias Token
              colorBgContainer: "#16181D",
            },
            // if a component type needs special styling, setting here will override default options set in token
            components: {
              Button: {
                colorPrimary: "#303030", // this will color all buttons in #75bd9d, overriding the default primaryColor #22426b set in token line 35
                algorithm: true, // enable algorithm (redundant with line 33 but here for demo purposes)
                controlHeight: 38,
              },
              Input: {
                colorBorder: "gray", // color boarder selected is not overridden but instead is set by primary color in line 35
                colorTextPlaceholder: "#888888",
                colorBgContainer: "#e2e2e2",
                algorithm: false, // disable algorithm (line 32)
              },
              Form: {
                labelColor: "#fff",
                algorithm: theme.defaultAlgorithm, // specify a specifc algorithm instead of true/false
              },
              Card: {},
            },
          }}
        >
          <AntdRegistry>
            <ToastProvider>
              <AuthProvider>
                <RoadtripInvitationProvider>
                  {children}
                </RoadtripInvitationProvider>
              </AuthProvider>
            </ToastProvider>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
