"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Banner() {
    const pathname = usePathname();
    
    // Hide the banner on the home page
    if (pathname === "/") {
        return null;
    }
    
    return (
        <header className="banner" style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <Link href={"/"}>
            <Image src="/logo-modified.png" alt="Logo" width={120} height={88} />
            </Link>
        </header>
    );
}
