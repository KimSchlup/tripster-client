"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "./SidebarMenu";

type HeaderProps = {
  isLoggedIn?: boolean;
  isLoginPage?: boolean;
};

export default function Header({ isLoggedIn = false, isLoginPage = false }: HeaderProps) {

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine which header variant to show
  const getHeaderVariant = () => {
    if (isLoginPage) {
      return "Login & Register Header";
    } else if (!isLoggedIn) {
      return "NotLoggedIn";
    }
    return "Default";
  };

  const headerVariant = getHeaderVariant();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // This functionality is now handled in the SidebarMenu component

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header 
        data-property-1={headerVariant}
        style={{
          width: "100%",
          height: 144,
          padding: "22px 24px",
          background: "white",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: headerVariant === "NotLoggedIn" ? "center" : "flex-start",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
        }}
      >
        {/* Left section with burger menu */}
        <div 
          className="burger-menu"
          data-clicked="Default" 
          data-state="Default" 
          style={{
            width: 36,
            height: 36,
            position: "relative",
            background: "white",
            overflow: "hidden",
            cursor: "pointer",
            alignSelf: "center"
          }}
          onClick={toggleMenu}
        >
        <div style={{width: 36, height: 36, left: 0, top: 0, position: "absolute", overflow: "hidden"}}>
          <div style={{width: 36, height: 6.80, left: 0, top: 29.20, position: "absolute", background: "rgba(0, 0, 0, 0.20)"}} />
          <div style={{width: 36, height: 6.80, left: 0, top: 14.60, position: "absolute", background: "rgba(0, 0, 0, 0.20)"}} />
          <div style={{width: 36, height: 6.80, left: 0, top: 0, position: "absolute", background: "rgba(0, 0, 0, 0.20)"}} />
          </div>
      </div>

      {/* Middle section with logo */}
      <div 
        data-size={headerVariant === "NotLoggedIn" ? "Size3" : "big"} 
        style={{
          width: headerVariant === "NotLoggedIn" ? 393 : "100%",
          height: headerVariant === "NotLoggedIn" ? 137 : 102,
          position: "relative",
          background: "white",
          overflow: "hidden",
          display: "flex",
          justifyContent: headerVariant === "NotLoggedIn" ? "flex-start" : "center",
          alignItems: "center"
        }}
      >
        <Link href="/">
          <Image 
            src="/logo-modified.png" 
            alt="Logo" 
            width={121} 
            height={88} 
            style={{
              position: headerVariant === "NotLoggedIn" ? "absolute" : "relative",
              left: headerVariant === "NotLoggedIn" ? 264.69 : "auto",
              top: headerVariant === "NotLoggedIn" ? 33 : "auto",
            }}
          />
        </Link>
        {headerVariant === "NotLoggedIn" && (
          <div style={{width: 100, height: 100, left: 136, top: 26, position: "absolute"}} />
        )}
      </div>

      {/* Right section - login/register buttons only for NotLoggedIn variant */}
      {headerVariant === "NotLoggedIn" && (
        <div style={{width: 288, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div 
            data-clicked="Clicked" 
            data-state="Default" 
            style={{
              width: 130,
              padding: "16px 20px",
              background: "black",
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              cursor: "pointer"
            }}
            onClick={handleLogin}
          >
            <div style={{color: "white", fontSize: 20, fontFamily: "Manrope", fontWeight: "700", wordWrap: "break-word"}}>
              Login
            </div>
          </div>
          <div 
            data-clicked="Clicked" 
            data-state="Default" 
            style={{
              width: 130,
              padding: "16px 20px",
              background: "black",
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              cursor: "pointer"
            }}
            onClick={handleRegister}
          >
            <div style={{textAlign: "center", color: "white", fontSize: 20, fontFamily: "Manrope", fontWeight: "700", wordWrap: "break-word"}}>
              Register
            </div>
          </div>
        </div>
      )}
      </header>

      {/* Sidebar Menu Component */}
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
