// components/Banner.tsx
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
    return (
        <header className="banner">
            <Link href={"/"}>
            <Image src="/logo-modified.png" alt="Logo" width={120} height={88} />
            </Link>
        </header>
    );
}
