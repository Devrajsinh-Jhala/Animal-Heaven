"use client";
import Image from "next/image";
import { ModeToggle } from "./ThemeToggle";
import logo from "@/public/assets/logo.png";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

type Props = {};
const Navbar = ({}: Props) => {
  const navLinks = [
    { name: "About", link: "/about" },
    { name: "Blogs", link: "/blog" },
    { name: "Courses", link: "/courses" },
    { name: "Pricing", link: "/pricing" },
  ];
  const user = useUser();
  return (
    <nav className="border-b border w-full py-1">
      <div className=" max-w-6xl mx-auto bg-background h-[10vh] flex items-center justify-between p-4">
        {/* Text */}
        <Link href={"/"}>
          <div className="flex items-center justify-center gap-1">
            <div className="relative w-6 h-6">
              <Image src={logo.src} alt="Logo" fill />
            </div>
            <p className="font-bold">Animal Heaven</p>
          </div>
        </Link>
        {/* Menu Items */}
        <ul className="flex items-center justify-center gap-x-3">
          {navLinks.map((navLink, index) => (
            <Button className="text-base" key={index} variant={"link"} asChild>
              <Link href={navLink.link}>
                <li>{navLink.name}</li>
              </Link>
            </Button>
          ))}
        </ul>

        {/* Login + Theme Button */}
        <div className="flex items-center justify-center gap-5">
          {user.isSignedIn ? (
            <div>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button variant={"secondary"}>Sign In</Button>
            </SignInButton>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
