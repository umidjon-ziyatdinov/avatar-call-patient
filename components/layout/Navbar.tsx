"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ModeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4 flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            aria-label="Reminisce AI Homepage"
          >
            {/* <Image
              src="/logo.svg"
              alt="Reminisce AI Logo"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-110"
            /> */}
            <span className=" font-heading text-[1.5rem] font-bold sm:inline-block group-hover:text-primary transition-colors">
              Reminisce AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative text-md font-medium 
                transition-colors duration-300 
                group
                ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }
              `}
            >
              {item.name}
              <span
                className={`
                  absolute bottom-[-3px] left-0 w-0 h-[2px] 
                  bg-primary 
                  transition-all duration-300 
                  group-hover:w-full
                  ${pathname === item.href ? "w-full" : ""}
                `}
              />
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <ModeToggle />

          {/* Login Button */}
          <Button
            variant="ghost"
            size="lg"
            className="hidden md:inline-flex border items-center gap-2 hover:bg-primary transition-colors"
            onClick={() => router.push("/login")}
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>

          {/* Schedule Consultation Button */}
          {/* Schedule Consultation Button */}
          <Button
            asChild
            variant="default"
            size="lg"
            className="hidden md:inline-flex 
              bg-secondary hover:bg-secondary/90 
              text-primary-foreground 
              border-none
              rounded
              px-4
              relative
              transition-all duration-300 
              font-bold 
              font-heading
              active:scale-95"
          >
            <Link
              href="https://meetings.hubspot.com/reminisceai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Schedule a free consultation"
              className="flex items-center font-bold gap-2"
            >
              Schedule a Call
              <Calendar className="h-4 w-4" />
              <div className="absolute -top-1 -right-2 text-[12px] font-heading bg-primary text-primary-foreground px-2 py-0 rounded-full rotate-[30deg] font-medium ">
                Free
              </div>
            </Link>
          </Button>
          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:max-w-sm">
              <div className="flex flex-col gap-6 px-2 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-heading text-lg font-bold">
                    Reminisce AI
                  </span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          text-sm font-medium 
                          transition-colors 
                          hover:text-primary 
                          ${
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground/70"
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}

                  {/* Mobile Login */}
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full borde r justify-start gap-2 hover:bg-secondary/30"
                      onClick={() => router.push("/login")}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </SheetClose>

                  {/* Mobile Schedule Consultation */}
                  <SheetClose asChild>
                    <Button asChild className="mt-2 w-full" size="sm">
                      <Link
                        href="https://meetings.hubspot.com/reminisceai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Schedule Consultation
                        <span className="text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded-full">
                          Free
                        </span>
                      </Link>
                    </Button>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
