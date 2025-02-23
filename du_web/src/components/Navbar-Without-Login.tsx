"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import logo from "@/public/logo.png"
import { usePathname } from "next/navigation";

export default function NavbarWithoutLogin() {
  const { theme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-transparent dark:bg-transparen dark:border-slate-800 backdrop-blur-md">
  
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div>
              <Image
                src={theme === "dark" ? logo : logo}
                alt="logo"
                width={50}
                height={50}
                className="rounded-md"
              />
            </div>
            <span className="font-montserrat font-bold text-3xl">DU-HACKS-25 25</span>
          </div>
  
          <Button variant={"link"}>
            <Link href="/landing" className="flex items-center">
              Blablabla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
  
}
